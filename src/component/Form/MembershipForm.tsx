import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Membership } from "../../types/Membership";
import { useTranslation } from "react-i18next";
import { OptionsSelect } from '../../types/OptionsSelect';

type IMembershipForm = {
  membership: Membership | undefined;
}

export default function MembershipForm(props: IMembershipForm) {
    const { t } = useTranslation('global');
    const { register, handleSubmit, formState: { errors } } = useForm<Membership>();
    const [init, setInit] = useState(true);
    const [valueMembership, setValueMembership] = useState<Membership>({
        contributionStatus: 'no adherent',
        dateContribution: null,
        endDateContribution: null,
        contribution: '',
    });

    const propValueMembership = Object.keys(valueMembership); // Properties for creating a field form

    const initUser = useCallback(() => {
        if(props.membership) {
            setValueMembership({
                ...valueMembership,
                contributionStatus: props.membership?.contributionStatus || 'no adherent',
                dateContribution: props.membership?.dateContribution || null,
                endDateContribution: props.membership?.endDateContribution || null,
            });
        }
    }, [valueMembership, props]);

    const disabledInput = (field: keyof Membership, id: number) => {
        return (
            <div key={'input-' + id}  className='container-input-and-select'>
                <label className='label-form' htmlFor={field}>
                    {field} :
                </label>
                <input
                    disabled
                    value={valueMembership[field] ? valueMembership[field].toString() : undefined  }
                    className='form-control shadow_background-input input-form'
                    type={field.includes('contributionStatus') ? 'Text' : 'Date'}
                    name={field}
                    id={field}
                />
            </div>
        );
    };

    const contributionOptions: OptionsSelect[] = [
        { value: '30CHF', name: '30 CHF/3mois' },
        { value: '60CHF', name: '60 CHF/6mois' },
        { value: '100CHF', name: '100 CHF/1an' },
    ];
    const optionSelect = (name: string): OptionsSelect[] => {
        let options: OptionsSelect[] = [];
        if (name === 'contribution') options = contributionOptions;
        return options;
    };

    const displaySelect = (field: keyof Membership, id: number) => {
        return ( 
            <div key={'input-' + id}  className='container-input-and-select'>
                <label className='label-form' htmlFor={field}>
                    {field}
                </label>
                <select
                    {...register(field)}
                    className='form-select shadow_background-input position-flag-select design rounded-pill'
                    name={field}
                    id={field}
                >
                    <option value=''>
                        DEFAULT
                    </option>
                    {optionSelect(field).map((option: OptionsSelect, id) => {
                        return (
                            <option key={'option-' + id} value={option.value}>
                                {option.name}
                            </option>
                        );
                    })}
                </select>
                {errors[field] && <p className="m-0 text-danger">{errors[field].message?.toString()}</p>}
            </div>
        );
    };

    const onSubmit = handleSubmit((data) => {
        console.log("Ça t'amuse d'enlever les disabled :D");
        console.log(data);
    });

    useEffect(() => {
        if(init && props.membership) {
            initUser();
            setInit(false);
        }
    }, [initUser, init, props]);

    return (
        <form className='form all-form-setting' onSubmit={onSubmit}>
            <div className='div-under-form'>
                { propValueMembership.map((field: string, id: number) => {
                    return (
                        field !== 'contribution' ?
                            disabledInput(field as keyof Membership, id) :
                            displaySelect(field as keyof Membership, id)
                    );
                })}
            </div>
            <button disabled className='btn btn-form padding-button' type="submit">
                  SEND
            </button>
        </form>
    ); 
}