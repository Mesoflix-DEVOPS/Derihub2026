import React from 'react';
import { observer } from '@deriv/stores';
import './premium-bot-card.scss';

type TPremiumBotProps = {
    name: string;
    description: string;
    price_usd: string;
    price_ksh: string;
    is_v2?: boolean;
};

const PremiumBotCard = observer(({ name, description, price_usd, price_ksh, is_v2 }: TPremiumBotProps) => {
    const handlePurchase = () => {
        const message = encodeURIComponent(`i want to purchase this bot: ${name}`);
        window.open(`https://wa.me/254741718032?text=${message}`, '_blank');
    };

    return (
        <div className='dbot-green-card premium-bot-card'>
            {/* Animated background circuit lines */}
            <div className='dbot-green-card__circuits'>
                {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
            </div>

            {/* Floating green particles */}
            <div className='dbot-green-card__particles'>
                {Array.from({ length: 8 }).map((_, i) => <span key={i} />)}
            </div>

            {/* PURCHASE badge - top right */}
            <div className='dbot-green-card__premium'>★ FOR SALE</div>

            {/* Header */}
            <div className='dbot-green-card__header'>
                <div className='dbot-green-card__icon'>{is_v2 ? '🔥' : '💎'}</div>
                <div className='dbot-green-card__meta'>
                    <div className='dbot-green-card__name'>{name}</div>
                    <div className='dbot-green-card__timeframe'>Premium Trading AI</div>
                </div>
            </div>

            {/* Description */}
            <div className='dbot-green-card__description'>
                {description}
            </div>

            {/* Price section */}
            <div className='premium-bot-card__price-container'>
                <div className='premium-bot-card__price-usd'>{price_usd}</div>
                <div className='premium-bot-card__price-ksh'>({price_ksh})</div>
            </div>

            {/* Purchase Button */}
            <button className='dbot-green-card__load-btn purchase-btn' onClick={handlePurchase}>
                <span className='dbot-green-card__load-icon'>💰</span>
                <span>Purchase Bot</span>
                <span className='dbot-green-card__load-arrow'>→</span>
            </button>

            {/* Green shine sweep */}
            <div className='dbot-green-card__shine' />
        </div>
    );
});

export default PremiumBotCard;
