import React from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';

import UsersRepository from 'repositories/UsersRepository';
import UserPresenter from 'presenters/UserPresenter';

import useStyles from './useStyles';

const UserSelect = ({ error, label, isClearable, isDisabled, isRequired, onChange, value, helperText }) => {
  const styles = useStyles();
  const handleOptionsLoad = (inputValue) =>
    UsersRepository.index({ q: { firstNameOrLastNameCont: inputValue } }).then(({ data }) => data.items);

  return (
    <>
      <FormControl margin="dense" disabled={isDisabled} error={error} required={isRequired}>
        <InputLabel shrink>{label}</InputLabel>
        <div className={styles.select}>
          <AsyncSelect
            cacheOptions
            loadOptions={handleOptionsLoad}
            defaultOptions
            getOptionLabel={UserPresenter.fullName}
            getOptionValue={UserPresenter.id}
            isDisabled={isDisabled}
            isClearable={isClearable}
            defaultValue={value}
            onChange={onChange}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </>
  );
};

UserSelect.propTypes = {
  error: PropTypes.bool,
  label: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape(),
  helperText: PropTypes.string,
};

UserSelect.defaultProps = {
  value: null,
  error: false,
  isClearable: false,
  isDisabled: false,
  isRequired: true,
  helperText: '',
};

export default UserSelect;
