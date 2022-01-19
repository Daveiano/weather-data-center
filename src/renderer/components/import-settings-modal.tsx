import React, {FunctionComponent, useEffect, useRef, useState} from 'react';

import {Form, TextInput, Modal, Row, Column, Loading, InlineNotification} from "carbon-components-react";

import {Formik} from "formik";
import * as Yup from 'yup';
import moment from "moment";

type ImportSettingsModalProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  config: ImportSettingsFormValues,
};

export interface ImportSettingsFormValues {
  import_date_format: string,
  header_time: string,
  unit_temperature: string,
  header_temperature: string,
  header_felt_temperature: string,
  header_dew_point: string,
  unit_rain: string,
  header_rain: string,
  unit_humidity: string,
  header_humidity: string,
  unit_pressure: string,
  header_pressure: string,
  unit_wind: string,
  unit_wind_direction: string,
  header_wind: string,
  header_wind_direction: string,
  header_gust: string,
  unit_solar: string,
  header_solar: string,
  header_uvi: string
}

export const ImportSettingsModal:FunctionComponent<ImportSettingsModalProps> = (props: ImportSettingsModalProps): React.ReactElement => {
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useRef(null);
  const modal = useRef(null);
  const initialValues: ImportSettingsFormValues = props.config ? props.config : {
    import_date_format: '',
    header_time: '',
    unit_temperature: '',
    header_temperature: '',
    header_felt_temperature: '',
    header_dew_point: '',
    unit_rain: '',
    header_rain: '',
    unit_humidity: '',
    header_humidity: '',
    unit_pressure: '',
    header_pressure: '',
    unit_wind: '',
    unit_wind_direction: '',
    header_wind: '',
    header_wind_direction: '',
    header_gust: '',
    unit_solar: '',
    header_solar: '',
    header_uvi: ''
  };

  useEffect(() => {
    const removeEventListener = window.electron.IpcOn('config-saved', () => configSavedListener());

    return () => {
      removeEventListener();
    };
  }, []);

  const configSavedListener = () => {
    setIsSubmitting(false);
    setSaved(true);

    if (modal.current) {
      const modalContent = modal.current.querySelector('.bx--modal-content');
      modalContent.scrollTop = modalContent.scrollHeight;
    }
  };

  const submissionHandler = (values: ImportSettingsFormValues) => {
    setIsSubmitting(true);

    setTimeout(() => {
      window.electron.IpcSend('config', [values]);
    }, 800);
  }

  return (
    <div ref={modal}>
      <Modal
        open={props.open}
        modalHeading="Settings"
        modalLabel="Units & Import"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onRequestClose={() => props.setOpen(false)}
        onRequestSubmit={() => form.current.handleSubmit()}
        primaryButtonDisabled={isSubmitting}
      >
        <div className="bx--type-body-short-01" style={{marginBottom: '2rem'}}>
          Here you can change the name of the headers for each characteristic. For example the software will look
          for a column in your csv named &quot;pressure&quot; to get the pressure values. You can change this
          behaviour if you change the value of &quot;Header Pressure&quot; in the form.
          <br/>
          <br/>
          You can also change the display unit of each characteristic.
          <br/>
          <strong>Note:</strong> This is only for displaying, there is no conversion done.
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={submissionHandler}
          validationSchema={Yup.object().shape({
            header_time: Yup.string().required(),
            import_date_format: Yup.string().required(),
            unit_temperature: Yup.string().required(),
            header_temperature: Yup.string().required(),
            header_felt_temperature: Yup.string().required(),
            header_dew_point: Yup.string().required(),
            unit_rain: Yup.string().required(),
            header_rain: Yup.string().required(),
            unit_humidity: Yup.string().required(),
            header_humidity: Yup.string().required(),
            unit_pressure: Yup.string().required(),
            header_pressure: Yup.string().required(),
            unit_wind: Yup.string().required(),
            unit_wind_direction: Yup.string().required(),
            header_wind: Yup.string().required(),
            header_wind_direction: Yup.string().required(),
            header_gust: Yup.string().required(),
            unit_solar: Yup.string().required(),
            header_solar: Yup.string().required(),
            header_uvi: Yup.string().required(),
          })}
          innerRef={form}
        >
          {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit
            }) => (
            <div>
              <Form
                onSubmit={handleSubmit}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {isSubmitting &&
                  <Loading
                    description="Saving config..."
                    withOverlay={true}
                    data-testid="modal-loading"
                  />
                }

                <h3 className="bx--type-productive-heading-02" style={{ marginBottom: '0.5rem' }}>Units</h3>
                <Row>
                  <Column sm={6} lg={6} max={6}>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="unit_pressure"
                        type="text"
                        name="unit_pressure"
                        labelText="Unit pressure"
                        placeholder="hPa"
                        value={values.unit_pressure}
                        invalidText={errors.unit_pressure}
                        invalid={Boolean(touched.unit_pressure && errors.unit_pressure)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="unit_solar"
                        type="text"
                        name="unit_solar"
                        labelText="Unit solar radiation"
                        placeholder="w/m²"
                        value={values.unit_solar}
                        invalidText={errors.unit_solar}
                        invalid={Boolean(touched.unit_solar && errors.unit_solar)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="unit_wind"
                        type="text"
                        name="unit_wind"
                        labelText="Unit wind"
                        placeholder="km/h"
                        value={values.unit_wind}
                        invalidText={errors.unit_wind}
                        invalid={Boolean(touched.unit_wind && errors.unit_wind)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="unit_humidity"
                        type="text"
                        name="unit_humidity"
                        labelText="Unit humidity"
                        placeholder="%"
                        value={values.unit_humidity}
                        invalidText={errors.unit_humidity}
                        invalid={Boolean(touched.unit_humidity && errors.unit_humidity)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </Column>
                  <Column sm={6} lg={6} max={6}>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="unit_temperature"
                        type="text"
                        name="unit_temperature"
                        labelText="Unit temperature"
                        placeholder="°C, F, ..."
                        value={values.unit_temperature}
                        invalidText={errors.unit_temperature}
                        invalid={Boolean(touched.unit_temperature && errors.unit_temperature)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="unit_rain"
                        type="text"
                        name="unit_rain"
                        labelText="Unit rain"
                        placeholder="mm, l, ..."
                        value={values.unit_rain}
                        invalidText={errors.unit_rain}
                        invalid={Boolean(touched.unit_rain && errors.unit_rain)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="unit_wind_direction"
                        type="text"
                        name="unit_wind_direction"
                        labelText="Unit wind direction"
                        placeholder="°"
                        value={values.unit_wind_direction}
                        invalidText={errors.unit_wind_direction}
                        invalid={Boolean(touched.unit_wind_direction && errors.unit_wind_direction)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </Column>
                </Row>

                <h3 className="bx--type-productive-heading-02" style={{ marginBottom: '0.5rem' }}>Import</h3>
                <Row>
                  <Column sm={12} lg={12} max={12}>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_time"
                        type="text"
                        name="header_time"
                        labelText="Header time"
                        placeholder="time"
                        value={values.header_time}
                        invalidText={errors.header_time}
                        invalid={Boolean(touched.header_time && errors.header_time)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="import_date_format"
                        type="text"
                        name="import_date_format"
                        labelText="Date format"
                        helperText={
                          <>
                            Date format of you input date. The default of YYYY/M/D k:m is equivalent to
                            {moment().format('YYYY/M/D k:m')}. For more info visit the <a target="_blank" href="https://daveiano.github.io/weather-data-center/" rel="noreferrer">docs</a>.
                          </>
                        }
                        placeholder="YYYY/M/D k:m"
                        value={values.import_date_format}
                        invalidText={errors.import_date_format}
                        invalid={Boolean(touched.import_date_format && errors.import_date_format)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </Column>
                  <Column sm={6} lg={6} max={6}>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_pressure"
                        type="text"
                        name="header_pressure"
                        labelText="Header Pressure"
                        placeholder="pressure"
                        value={values.header_pressure}
                        invalidText={errors.header_pressure}
                        invalid={Boolean(touched.header_pressure && errors.header_pressure)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_solar"
                        type="text"
                        name="header_solar"
                        labelText="Header solar"
                        placeholder="solar"
                        value={values.header_solar}
                        invalidText={errors.header_solar}
                        invalid={Boolean(touched.header_solar && errors.header_solar)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_uvi"
                        type="text"
                        name="header_uvi"
                        labelText="Header UVI"
                        placeholder="uvi"
                        value={values.header_uvi}
                        invalidText={errors.header_uvi}
                        invalid={Boolean(touched.header_uvi && errors.header_uvi)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_temperature"
                        type="text"
                        name="header_temperature"
                        labelText="Header temperature"
                        placeholder="temperature"
                        value={values.header_temperature}
                        invalidText={errors.header_temperature}
                        invalid={Boolean(touched.header_temperature && errors.header_temperature)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_felt_temperature"
                        type="text"
                        name="header_felt_temperature"
                        labelText="Header felt temperature"
                        placeholder="felt_temperature"
                        value={values.header_felt_temperature}
                        invalidText={errors.header_felt_temperature}
                        invalid={Boolean(touched.header_felt_temperature && errors.header_felt_temperature)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_dew_point"
                        type="text"
                        name="header_dew_point"
                        labelText="Header dew point temperature"
                        placeholder="dew_point"
                        value={values.header_dew_point}
                        invalidText={errors.header_dew_point}
                        invalid={Boolean(touched.header_dew_point && errors.header_dew_point)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </Column>
                  <Column sm={6} lg={6} max={6}>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_rain"
                        type="text"
                        name="header_rain"
                        labelText="Header Rain"
                        placeholder="rain"
                        value={values.header_rain}
                        invalidText={errors.header_rain}
                        invalid={Boolean(touched.header_rain && errors.header_rain)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_humidity"
                        type="text"
                        name="header_humidity"
                        labelText="Header Humidity"
                        placeholder="humidity"
                        value={values.header_humidity}
                        invalidText={errors.header_humidity}
                        invalid={Boolean(touched.header_humidity && errors.header_humidity)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_wind"
                        type="text"
                        name="header_wind"
                        labelText="Header wind"
                        placeholder="wind"
                        value={values.header_wind}
                        invalidText={errors.header_wind}
                        invalid={Boolean(touched.header_wind && errors.header_wind)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_gust"
                        type="text"
                        name="header_gust"
                        labelText="Header gust"
                        placeholder="gust"
                        value={values.header_gust}
                        invalidText={errors.header_gust}
                        invalid={Boolean(touched.header_gust && errors.header_gust)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <TextInput
                        id="header_wind_direction"
                        type="text"
                        name="header_wind_direction"
                        labelText="Header wind direction"
                        placeholder="wind_direction"
                        value={values.header_wind_direction}
                        invalidText={errors.header_wind_direction}
                        invalid={Boolean(touched.header_wind_direction && errors.header_wind_direction)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </Column>
                </Row>

                {saved &&
                  <InlineNotification
                    kind="success"
                    iconDescription="Close"
                    title="Settings successfully saved."
                  />
                }
              </Form>
            </div>
          )}
        </Formik>
      </Modal>
    </div>
  );
};