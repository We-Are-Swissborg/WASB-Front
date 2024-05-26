import { useTranslation } from 'react-i18next';
import '../css/Modal.css';

interface IModal {
  msgModal: string,
  heightModal: string,
}

export default function Modal(props: IModal) {
    const { t } = useTranslation('global');

    const styleContainerModal = {
        display: props.msgModal ? 'flex' : 'none',
        opacity: props.msgModal ? 1 : 0,
    };

    const styleModal = {
        height: props.heightModal,
    };

    return (
        <div className="container-modal" style={styleContainerModal}>
            <div className="modal-custom" id="exampleModal" style={styleModal}>
                <p className="msg-modal-custom">
                    {t(`modal.${props.msgModal}`)}
                </p>
            </div>
        </div>
    );
}