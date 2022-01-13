import { useEffect } from 'react';
import { useMediaQuery } from 'hooks';

function CryptoWidget(props) {
    const mobile = useMediaQuery('(max-width: 768px)');
    const onlyTablet = useMediaQuery(
        '(min-width: 768px) and (max-width: 1200px)'
    );

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://crypto.com/price/static/widget/index.js";
        script.async = true;

        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <>
            <section style={{ position: 'relative', display: `${!onlyTablet && !mobile && props.pathName === '/' ? 'block' : 'none'}`, maxWidth: '1400px', margin: 'auto', marginTop: '-600px', padding: '100px 72px 0px 72px', zIndex: '10' }}>
                <div
                    id="crypto-widget-CoinMarquee"
                    data-transparent="true"
                    data-design="classic"
                    data-coins="decentral-games,decentral-games-ice"
                    style={{ marginTop: '-50px', marginLeft: '-20px' }}
                />
            </section>
        </>
    );
}

export default CryptoWidget;
