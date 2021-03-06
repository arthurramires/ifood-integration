import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { InputContainer, Inputs } from './styles';

export default function Input({ name, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField } = useField(name);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);
  return (
    <InputContainer>
        <Inputs ref={inputRef} defaultValue={defaultValue} {...rest} />
    </InputContainer>
  );
}