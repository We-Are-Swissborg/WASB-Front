import * as SessionAdminServices from '@/administration/services/sessionAdmin.service';
import UploadImage from '@/component/Form/UploadImage';
import { useAuth } from '@/contexts/AuthContext';
import Editor from '@/hook/Editor';
import { Session, SessionStatus } from '@/types/Session';
import { UploadFile } from '@/types/UploadFile';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr } from 'date-fns/locale';
import Quill from 'quill';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AdminSession() {
    const navigate = useNavigate();
    const { t } = useTranslation('global');
    const { token } = useAuth();
    const { id } = useParams();
    const [session, setSession] = useState<Session>();
    const quillRef = useRef<Quill | null>(null);
    const [isInitializing, setIsInitializing] = useState<boolean>(false);

    const { register, handleSubmit, formState, control, setValue } = useForm<Session>({
        mode: 'onTouched',
        defaultValues: {
            status: SessionStatus.Draft,
        },
    });
    const { isSubmitting, errors, isDirty, isValid } = formState;

    const initSession = useCallback(
        async (session: Session) => {
            setSession(session);
            setValue('id', session.id);
            setValue('createdAt', new Date(session.createdAt));
            setValue('updatedAt', new Date(session.updatedAt));
            setValue('title', session.title);
            setValue('status', session.status);
            setValue('startDateTime', new Date(session.startDateTime));
            setValue('endDateTime', session.endDateTime ? new Date(session.endDateTime) : undefined);
            setValue('membersOnly', session.membersOnly);
            setValue('url', session.url);
            setValue('description', session.description);
            setValue('image', session.image);
        },
        [setValue],
    );

    const getSession = useCallback(async () => {
        if (id && token) {
            try {
                const session = await SessionAdminServices.getSession(Number(id), token!);
                initSession(session);
            } catch (error) {
                toast.error(`Erreur lors du chargement de la session`);
                console.log('ERROR: init Session', e);
            }
        }
    }, [id, token, initSession]);

    const initForm = useCallback(async () => {
        try {
            await getSession();
        } catch (e) {
            toast.error(`Erreur lors de l'initialisation du formulaire`);
            console.log('ERROR: init Form Contribution', e);
        } finally {
            setIsInitializing(true);
        }
    }, [getSession]);

    useEffect(() => {
        if (!isInitializing) {
            initForm();
        }
    }, [initForm, isInitializing]);

    const onSubmit = async (data: Session) => {
        if (isDirty && isValid) {
            try {
                if (data.id) {
                    await SessionAdminServices.update(data.id, token!, data);
                    toast.success(t('register.update'));
                } else {
                    await SessionAdminServices.create(token!, data);
                    toast.success(t('session.create'));
                }
                // navigate('/admin/meetup');
            } catch {
                toast.error(t('session.error'));
            }
        }
    };

    const handleImageUpload = async (data: UploadFile) => {
        setValue('image', data.filePath);
        session!.image64 = data.base64;
        setSession(session);
    };

    if (!isInitializing) {
        return <div>Loading</div>;
    }

    return (
        <>
            <div className="container-fluid">
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
                        <fieldset className="row g-3">
                            <legend>Session {!!session && <> - {session.title}</>}</legend>
                            <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <TextField
                                    type="text"
                                    id="title"
                                    label="Title"
                                    className="form-control"
                                    {...register('title', {
                                        value: session?.title,
                                        required: 'this is a required',
                                        maxLength: {
                                            value: 100,
                                            message: 'Max length is 100',
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'Min length is 3',
                                        },
                                    })}
                                    required
                                />
                                {errors?.title && <div className="text-danger">{errors.title.message}</div>}
                            </div>
                            <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl className="form-control">
                                            <InputLabel id="status">Statut</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="status"
                                                value={field.value || []}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                input={<OutlinedInput label="Statut" />}
                                                defaultValue={SessionStatus.Draft}
                                            >
                                                {Object.entries(SessionStatus).map(([key, value]) => (
                                                    <MenuItem key={key} value={value}>
                                                        {value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
                            </div>
                            {!!session?.createdAt && (
                                <>
                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                        <Controller
                                            name="createdAt"
                                            control={control}
                                            render={({ field }) => (
                                                <DateTimePicker
                                                    label="Créer le"
                                                    className="form-control"
                                                    value={field?.value}
                                                    onChange={(newValue) => field.onChange(newValue)}
                                                    disabled
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                        <Controller
                                            name="updatedAt"
                                            control={control}
                                            render={({ field }) => (
                                                <DateTimePicker
                                                    label="Mise à jour le"
                                                    className="form-control"
                                                    value={field?.value}
                                                    onChange={(newValue) => field.onChange(newValue)}
                                                    disabled
                                                />
                                            )}
                                        />
                                    </div>
                                </>
                            )}
                        </fieldset>
                        <fieldset className="row g-3">
                            <div className="col-lg-2 col-md-4 col-sm-12">
                                <Controller
                                    name="startDateTime"
                                    control={control}
                                    render={({ field }) => (
                                        <DateTimePicker
                                            label="Début de l'évènement"
                                            className="form-control"
                                            value={field?.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                        />
                                    )}
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-12">
                                <Controller
                                    name="endDateTime"
                                    control={control}
                                    render={({ field }) => (
                                        <DateTimePicker
                                            label="Fin de l'évènement"
                                            className="form-control"
                                            value={field?.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                        />
                                    )}
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <FormControlLabel
                                    className="form-check"
                                    control={
                                        <Controller
                                            name="membersOnly"
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    {...field}
                                                    checked={field.value}
                                                    defaultChecked={false}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                            )}
                                        />
                                    }
                                    label="Uniquement pour les membres ? "
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-12">
                                <TextField
                                    type="url"
                                    id="url"
                                    label="URL"
                                    className="form-control"
                                    {...register('url', {
                                        value: session?.url,
                                    })}
                                />
                                {errors?.url && <div className="text-danger">{errors.url.message}</div>}
                            </div>
                        </fieldset>
                        <fieldset className="row g-3">
                            <legend>Information sur la session</legend>
                            <UploadImage onUpload={handleImageUpload} />
                            <label>
                                Si vous uploadez un fichier, il faut également enregistrer le formulaire sinon il ne
                                sera pas pris en considération
                            </label>
                            {session?.image64 && (
                                <img
                                    src={session.image64}
                                    className="img-thumbnail"
                                    alt="Uploaded"
                                    style={{ width: '856px' }}
                                />
                            )}
                            <div className="col-6 mb-3">
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Editor
                                            ref={quillRef}
                                            readOnly={false}
                                            defaultValue={field.value}
                                            onTextChange={() => {
                                                const childNode = quillRef.current?.container.firstChild;
                                                const textContent = childNode?.textContent;
                                                let innerHTML = '';
                                                if (childNode instanceof HTMLElement) innerHTML = childNode?.innerHTML;
                                                if (!textContent) innerHTML = '';

                                                field.onChange(innerHTML);
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </fieldset>
                        <button type="submit" className="btn btn-success my-3">
                            {isSubmitting && (
                                <div className="spinner-border spinner-border-sm mx-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            )}
                            Submit
                        </button>
                    </form>
                </LocalizationProvider>
            </div>
        </>
    );
}
