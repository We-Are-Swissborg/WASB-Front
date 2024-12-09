import { forwardRef } from 'react';
import { OptionsSelect } from '@/types/OptionsSelect';
import { ControllerRenderProps } from 'react-hook-form';

type SelectProps = ControllerRenderProps & {
    label: string;
    options: OptionsSelect[];
    value?: string;
    isOptionNone?: boolean;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ name, options, label, value, onChange, isOptionNone = false }, ref) => {
        return (
            <>
                <label htmlFor={name} className="form-label">
                    {label}
                </label>
                <div className="selected-input">
                    <select
                        className="form-select"
                        name={name}
                        id={name}
                        onChange={onChange}
                        value={value || ''}
                        ref={ref}
                    >
                        {isOptionNone && <option value="">None</option>}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        );
    },
);

export default Select;
