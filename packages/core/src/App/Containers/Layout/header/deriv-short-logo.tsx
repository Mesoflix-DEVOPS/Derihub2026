import React from 'react';
import { useDevice } from '@deriv-com/ui';

const DerivShortLogo = () => {
    const { isMobile } = useDevice();
    return (
        <div className='header__menu-left-logo' style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
                fontSize: '22px',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #06D6A0, #22C55E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px'
            }}>
                {isMobile ? 'DH' : 'Derihub'}
            </span>
        </div>
    );
};

export default DerivShortLogo;
