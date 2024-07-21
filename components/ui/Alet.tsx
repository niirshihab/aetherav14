// src/components/ui/Alert.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Alert as BootstrapAlert } from 'react-bootstrap';

interface AlertProps {
  variant: string;
  children: React.ReactNode;
}

const Alert = ({ variant, children }: AlertProps) => {
  return <BootstrapAlert variant={variant}>{children}</BootstrapAlert>;
};

Alert.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Alert.defaultProps = {
  variant: 'primary',
};

export default Alert;