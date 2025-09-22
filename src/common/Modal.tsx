import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type IModal = {
    title?: string;
    text: string;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    confirm: boolean;
    setConfirm: Dispatch<SetStateAction<boolean>>;
};

export default function Modal(props: IModal) {
    const { t } = useTranslation();

    return (
        <Dialog open={props.open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            {props.title && <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>}
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{props.text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen(false)}>{t('modal.cancel')}</Button>
                <Button onClick={() => props.setConfirm(true)} value="true">
                    {t('modal.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
