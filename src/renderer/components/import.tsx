import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Button, ButtonSet, InlineNotification, SwitcherDivider} from 'carbon-components-react';
import {Settings16, Upload16} from "@carbon/icons-react";

import { isLoadingAction } from '../actions-app';
import {ImportSettingsModal} from "./import-settings-modal";
import {RootState} from "../renderer";

export const Import: React.FC = (): React.ReactElement => {
  const [numberOfDuplicated, setNumberOfDuplicated] = useState(0);
  const [numberOfLastImported, setNumberOfLastImported] = useState(0);
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState(null);

  const dataFromStore = useSelector((state: RootState) => state.appState.data);
  const loading = useSelector((state: RootState) => state.appState.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    window.electron.IpcOn('number-of-duplicates', uploadFileListener);
    window.electron.IpcOn('config', configListener);
    window.electron.IpcSend('config', null);
  }, []);

  const selectFile = (): void => {
    dispatch(isLoadingAction(true));
    window.electron.IpcSend('open-file-dialog', null);
  };

  const uploadFileListener = (event: any, arg: any): void => {
    setNumberOfDuplicated(arg[0][0]);
    setNumberOfLastImported(arg[0][1]);
  };

  const configListener = (event: any, arg: any): void => {
    setConfig(arg[0]);
  };

  return (
    <>
      <div className="import-action">
        <h2 className="bx--type-productive-heading-04">
          Database
        </h2>

        <div className="bx--type-body-short-01">
          Here you can import new data from a csv file. Your file must have named headers to make it able for the
          software to find and parse the values for every available characteristic. You can either rename the headers
          in your csv to match the standard ones the software uses, or set custom header names in the settings.
          <br />
          <br />
          For more info, please see the <a target="_blank" href="https://daveiano.github.io/weather-data-center/" rel="noreferrer">docs</a>.
          <br />
          <br />
          <strong>Important:</strong> Please have a look at the settings before hitting &apos;Import from CSV&apos;.
          <br/>
          <br/>
        </div>

        {numberOfDuplicated > 0 &&
          <InlineNotification
            kind={"error"}
            iconDescription="Close"
            subtitle={`${numberOfDuplicated} items were duplicate and are not imported.`}
            title="There were duplicate items!"
          />
        }

        {numberOfLastImported > 0 &&
          <InlineNotification
            kind="success"
            iconDescription="Close"
            subtitle={`${numberOfLastImported} items were successfully imported.`}
            title="Items successfully imported."
          />
        }

        <ButtonSet stacked={false} style={{ marginTop: '4rem' }}>
          <Button
            disabled={loading}
            renderIcon={Settings16}
            id="edit-import"
            kind='secondary'
            onClick={() => setOpen(true)}
          >
            Import settings
          </Button>
          <Button
            disabled={loading}
            renderIcon={Upload16}
            id="import"
            kind='primary'
            onClick={() => selectFile()}
          >
            Import from CSV
          </Button>
        </ButtonSet>
      </div>

      <SwitcherDivider />

      <div className="import-data">
        {dataFromStore.length > 0 &&
          <div style={{ textAlign: 'right' }}>
            {dataFromStore.length} records imported
          </div>
        }
      </div>

      {config &&
        <ImportSettingsModal
          open={open}
          setOpen={setOpen}
          config={config}
        />
      }
    </>
  );
}