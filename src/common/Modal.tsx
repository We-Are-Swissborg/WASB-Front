import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type IModal = {
  title?: string,
  text: string,
  open: string,
  setOpen: Dispatch<SetStateAction<string>>,
  confirm: string,
  setConfirm: Dispatch<SetStateAction<string>>
}

export default function Modal(props: IModal) {
    const { t } = useTranslation('global');

    return (
        <Dialog
            open={props.open === 'open'}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {props.title &&
              <DialogTitle id="alert-dialog-title">
                  {props.title}
              </DialogTitle>
            }
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{props.text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen('cancel')}>{t('modal.cancel')}</Button>
                <Button onClick={() => props.setConfirm('confirm')} value='true'>{t('modal.confirm')}</Button>
            </DialogActions>
        </Dialog>
    );
}
