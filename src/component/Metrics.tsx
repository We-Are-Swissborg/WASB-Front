import * as React from 'react';
import * as Router from 'react-router-dom';
import backArrow from '../assets/images/svg/back-arrow.svg';
import { getCryptoAvailable, getOneCrypto } from '../services/metrics.service';
import '../css/Metrics.css';
import { toast } from 'react-toastify';

function Metrics() {
    const [titleMetrics, setTitleMetrics] = React.useState('METRICS');
    const { crypto } = Router.useParams();
    const navigate = Router.useNavigate();
    const [dataCard, setDataCard] = React.useState<Record<string, string | undefined>[]>([]);
    const project = {
        borg: 'Swissborg',
        btc: 'Bitcoin',
        xbg: 'XBorg',
    };

    const createObjectCard = (res: Record<string, string | undefined>, arrayMetricsOrCrypto: Record<string, string | undefined>[]) => {
        const valueToDisplay = res.metricsCrypto ? res.metricsCrypto : res.cryptoAvailable;
        if(valueToDisplay) {
            for (const [key, value] of Object.entries(valueToDisplay)) {
                let v = value;
                if(!v) v = 'N/A';
                arrayMetricsOrCrypto.push({
                    key: key.toUpperCase(),  
                    value: v as string
                });
            }
        }
    };

    const displayCard = async (crypto: string | undefined) => {
        try {
            let res = undefined;
            const arrayMetricsOrCrypto: Record<string, string | undefined>[] = [];
            if(crypto) {
                res = await getOneCrypto(crypto);
                navigate('/metrics/' + crypto, {replace: true});
                setTitleMetrics(crypto);
            } else {
                res = await getCryptoAvailable();
                navigate('/metrics/', {replace: true});
                setTitleMetrics('METRICS');
            }

            createObjectCard(res, arrayMetricsOrCrypto);
            setDataCard(arrayMetricsOrCrypto);
        } catch (e) {
            console.error('Error to display card : ' + e);
            if(crypto) navigate('/metrics/', {replace: true});
            else toast.error('Error to display Metrics');
        }
    };

    React.useEffect(() => {
        if(crypto) {
            setTitleMetrics(crypto);
            displayCard(crypto);
        } else {
            setTitleMetrics('METRICS');
            displayCard('');
        }
    }, [crypto]);

    return (
        <div className='container mb-3'>
            <div>
                <h1 className={`title text-center mt-5 text-break ${crypto ? 'mb-0' : 'mb-5'}`}>{titleMetrics.toUpperCase()}</h1>
                { crypto && <p className='title text-center mb-5 text-break'>({project[crypto?.toLowerCase() as keyof object]})</p> }
            </div>
            <div className='d-flex flex-wrap justify-content-center flex'>
                {dataCard.map((data: Record<string, string | undefined>, idData) => {
                    return (
                        <div key={'card-'+idData} className='ms-4 me-4'>
                            {crypto ?
                                <div key={'card-'+idData} className='container-hexagonal'>
                                    <h2 className='text-white text-center text-wrap'>{data.key}</h2>
                                    <span className='text-white'>{data.value}</span>
                                </div> :
                                <a className='container-hexagonal scale-animation' onClick={() => displayCard(data.key)}> 
                                    <h2 className='text-white text-center text-nowrap'>{data.key}</h2>
                                    <p className='text-white text-center text-nowrap'>{project[data.key?.toLowerCase() as keyof object]}</p>
                                    <span className='text-white'>{data?.value}</span>
                                </a> 
                            }
                        </div>
                    );
                })}
                {crypto &&
                    <div className='ms-4 me-4'>
                        <a className='container-hexagonal back-card bg-primary scale-animation' onClick={() => displayCard('')}> 
                            <h2 className='text-white text-center'>BACK</h2>
                            <img src={backArrow} alt='arrow to back' className='back-arrow'/>
                        </a>
                    </div>
                }
            </div>
        </div>
    );
}

export default Metrics;