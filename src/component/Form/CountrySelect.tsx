import { forwardRef } from 'react';
import { OptionsCountrySelect } from '@/types/OptionsSelect';
import { ControllerRenderProps } from 'react-hook-form';
import '@/css/CountryFlag.css';

type CountrySelectProps = ControllerRenderProps & {
    label: string;
    options: OptionsCountrySelect[];
    value?: string;
};

const CountrySelect = forwardRef<HTMLSelectElement, CountrySelectProps>(
    ({ name, options, onChange, label, value, onBlur }, ref) => {
        const sortedOptions = options.sort((a, b) => a.name.localeCompare(b.name));

        const selectedCountryOption = sortedOptions.find((opt) => opt.value === value);

        return (
            <>
                <label htmlFor={name} className="form-label">
                    {label}
                </label>
                <div className="custom-select">
                    <div className="selected-input">
                        {selectedCountryOption && (
                            <img
                                src={selectedCountryOption?.urlImg}
                                alt={selectedCountryOption?.name}
                                style={{ marginRight: '10px', width: '20px', height: '20px' }}
                            />
                        )}
                        <select
                            className="form-select"
                            name={name}
                            id={name}
                            onChange={onChange}
                            value={value}
                            onBlur={onBlur}
                            ref={ref}
                        >
                            <option value="">None</option>
                            {sortedOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </>
        );
    },
);

export default CountrySelect;
