// src/components/form/SearchableSelect.tsx
'use client';

import React from 'react';
import Select, { OnChangeValue, StylesConfig } from 'react-select';
import { useTheme } from '@/context/ThemeContext'; // Importar el hook del tema

interface OptionType {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  id: string;
  name:string;
  value: string;
  options: OptionType[];
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  name,
  value,
  options,
  onChange,
  placeholder,
  required,
}) => {
  const { theme } = useTheme(); // Obtener el tema actual
  const selectedOption = options.find((option) => option.value === value);

  const handleChange = (selected: OnChangeValue<OptionType, false>) => {
    if (selected) {
      onChange(name, selected.value);
    } else {
      onChange(name, '');
    }
  };

  // Estilos personalizados para el componente Select
  const customStyles: StylesConfig<OptionType, false> = {
    control: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#1D2939' : '#FFFFFF',
      borderColor: theme === 'dark' ? '#4A5568' : '#D1D5DB',
      '&:hover': {
        borderColor: theme === 'dark' ? '#6366F1' : '#A5B4FC',
      },
    }),
    input: (base) => ({
      ...base,
      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#1D2939' : '#FFFFFF',
      zIndex: 9999, // Asegurar que el menú se superponga
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? theme === 'dark' ? '#4F46E5' : '#6366F1'
        : isFocused
        ? theme === 'dark' ? '#374151' : '#E0E7FF'
        : 'transparent',
      color: isSelected
        ? '#FFFFFF'
        : theme === 'dark' ? '#F9FAFB' : '#1F2937',
      '&:active': {
        backgroundColor: theme === 'dark' ? '#4338CA' : '#4F46E5',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
    }),
  };

  return (
    <Select
      id={id}
      name={name}
      value={selectedOption}
      options={options}
      onChange={handleChange}
      placeholder={placeholder}
      isClearable
      isSearchable
      required={required}
      styles={customStyles} // Aplicar los estilos personalizados
    />
  );
};

export default SearchableSelect;
