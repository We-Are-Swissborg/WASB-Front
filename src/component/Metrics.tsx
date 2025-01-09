import * as React from 'react';
import * as Router from 'react-router-dom';
import backArrow from '../assets/images/svg/back-arrow.svg';
import { getCryptoAvailable, getOneCrypto } from '../services/metrics.service';
import '../css/Metrics.css';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import project from '../hook/ProjectMetrics';

function Metrics() {
    const [titleMetrics, setTitleMetrics] = React.useState('METRICS');
    const { crypto } = Router.useParams();
    const navigate = Router.useNavigate();
    const { t } = useTranslation('global');
    const [dataCard, setDataCard] = React.useState<Record<string, string | undefined>[]>([]);
    const [lastUpdate, setLastUpdate] = React.useState<Date | undefined>();

    const createObjectCard = (
        res: Record<string, Record<string, string>> & Record<string, string>,
        arrayMetricsOrCrypto: Record<string, string | undefined>[],
    ) => {
        const valueToDisplay = res.metricsCrypto ? res.metricsCrypto : res.cryptoAvailable;

        setLastUpdate(new Date(valueToDisplay?.lastUpdate));
        if (valueToDisplay.crypto) {
            for (const [key, value] of Object.entries(valueToDisplay.crypto)) {
                let v = value;
                if (!v) v = 'N/A';
                arrayMetricsOrCrypto.push({
                    key: key,
                    value: v as string,
                });
            }
        }
    };

    const displayCard = async (crypto: string | undefined) => {
        try {
            let res = undefined;
            const arrayMetricsOrCrypto: Record<string, string | undefined>[] = [];
            if (crypto) {
                res = await getOneCrypto(crypto);
                navigate('/metrics/' + crypto, { replace: true });
                setTitleMetrics(crypto);
            } else {
                res = await getCryptoAvailable();
                navigate('/metrics/', { replace: true });
                setTitleMetrics('METRICS');
            }

            createObjectCard(res, arrayMetricsOrCrypto);
            setDataCard(arrayMetricsOrCrypto);
        } catch (e) {
            console.error('Error to display card : ' + e);
            if (crypto) navigate('/metrics/', { replace: true });
            else toast.error('Error to display Metrics');
        }
    };

    // Display last update compared with language of site.
    const manageLastUpdate = () => {
        const lang = localStorage.getItem('language');
        const local = lang === 'fr' ? 'fr-FR' : 'us-US';
        return lastUpdate?.toLocaleString(local);
    };

    React.useEffect(() => {
        if (crypto) {
            setTitleMetrics(crypto);
            displayCard(crypto);
        } else {
            setTitleMetrics('METRICS');
            displayCard('');
        }
    }, [crypto]);

    return (
        <div className="container mb-4">
            <div className="d-flex flex-column align-items-center">
                <div className="d-flex flex-column align-items-center mt-5 w-100 mb-4">
                    <h1 className="title text-center text-break">{titleMetrics.toUpperCase()}</h1>
                    {crypto && (
                        <>
                            <p className="title text-center text-break">
                                ({project[crypto?.toLowerCase() as keyof object]['name']})
                            </p>
                            <div className="d-flex w-100">
                                <ul className="d-flex list-unstyled justify-content-evenly m-0 w-100">
                                    {Object.values(project[crypto?.toLowerCase() as keyof object]['medias']).map(
                                        (media, id) => (
                                            <li key={'media-' + id}>{media}</li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
                {crypto && <p className="text-center mb-5">{t('metrics.description.' + crypto)}</p>}
            </div>
            <div className="d-flex flex-wrap justify-content-center flex">
                {dataCard.map((data: Record<string, string | undefined>, idData) => {
                    return (
                        <div key={'card-' + idData} className="ms-4 me-4">
                            {crypto ? (
                                <div key={'card-' + idData} className="container-hexagonal">
                                    <h2 className="text-white text-center text-wrap">{t('metrics.' + data.key)}</h2>
                                    <span className="text-white fs-4">{data.value}</span>
                                </div>
                            ) : (
                                <a
                                    className="container-hexagonal scale-animation"
                                    onClick={() => displayCard(data.key)}
                                >
                                    <h2 className="text-white text-center text-nowrap">
                                        {data.key?.toLocaleUpperCase()}
                                    </h2>
                                    <p className="text-white text-center text-nowrap fs-4">
                                        {project[data.key?.toLowerCase() as keyof object] &&
                                            project[data.key?.toLowerCase() as keyof object]['name']}
                                    </p>
                                    <span className="text-white fs-4">{data?.value}</span>
                                </a>
                            )}
                        </div>
                    );
                })}
                {crypto && (
                    <div className="ms-4 me-4">
                        <a
                            className="container-hexagonal back-card bg-primary scale-animation"
                            onClick={() => displayCard('')}
                        >
                            <h2 className="text-white text-center">{t('metrics.back')}</h2>
                            <img src={backArrow} alt="arrow to back" className="back-arrow" />
                        </a>
                    </div>
                )}
            </div>
            <p>{`${t('metrics.lastUpdate')} : ${manageLastUpdate()}`}</p>
        </div>
    );
}

export default Metrics;
