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
            <section style={{ position: 'relative', display: `${!onlyTablet && !mobile && props.pathName === '/' ? 'block' : 'none'}`, maxWidth: '1400px', margin: 'auto', marginTop: '-600px', padding: '100px 56px 0px 72px', zIndex: '10' }}>
                <div
                    id="crypto-widget-CoinMarquee"
                    data-transparent="true"
                    data-design="classic"
                    data-coins="ethereum,decentral-games,decentral-games-ice,decentral-games-governance-xdg"
                    style={{ marginTop: '-48px', marginLeft: '-17px' }}
                />
            </section>
        </>
    );
}

export default CryptoWidget;
