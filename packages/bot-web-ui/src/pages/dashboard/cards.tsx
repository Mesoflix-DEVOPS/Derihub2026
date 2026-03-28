import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendOpenEvent } from '../../analytics/rudderstack-common-events';
import { rudderStackSendDashboardClickEvent } from '../../analytics/rudderstack-dashboard';
import DashboardBotList from './bot-list/dashboard-bot-list';

const SvgMyComputer = ({ width, height }: { width: string | number; height: string | number }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V15C20 16.1046 19.1046 17 18 17H6C4.89543 17 4 16.1046 4 15V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 17V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgGoogleDrive = ({ width, height }: { width: string | number; height: string | number }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15L15 21H9L12.5 15H18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21L3 10.5L6 5M12.5 15L6 5H12L18.5 15M21 15L15 4.5L12 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SvgBotBuilder = ({ width, height }: { width: string | number; height: string | number }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7V11" stroke="currentColor" strokeWidth="2" />
        <path d="M8 16H8.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 16H16.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

const SvgQuickStrategy = ({ width, height }: { width: string | number; height: string | number }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const YouTubeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const TikTokIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.73-3.89-1.74-.14-.13-.24-.31-.36-.46-.01 1.88.01 3.75-.01 5.62-.17 2.04-1.25 3.93-2.97 5.05-1.79 1.17-4.06 1.48-5.99.73-1.94-.73-3.48-2.32-4.02-4.22-.67-2.3-.31-4.91 1.04-6.84 1.2-1.74 3.19-2.85 5.3-2.91.05 0 .09-.01.14-.01v4.06c-.12.01-.24.04-.36.06-1.46.18-2.73 1.15-3.13 2.53-.44 1.51.18 3.22 1.44 4.08 1.28.87 3.06.77 4.23-.23.17-.15.34-.31.44-.51.27-.49.33-1.06.33-1.62V.02Z" />
    </svg>
);

const TelegramIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 8.146l-2.003 9.445c-.149.659-.539.822-1.091.511l-3.051-2.247-1.47 1.415c-.163.163-.299.299-.614.299l.219-3.102 5.645-5.1c.245-.218-.054-.338-.379-.122l-6.979 4.394-3.006-.939c-.654-.204-.666-.654.137-.966l11.748-4.527c.544-.198 1.019.127.834.938z" />
    </svg>
);

const customIcons: Record<string, React.FC<{ width: string | number; height: string | number }>> = {
    'my-computer': SvgMyComputer,
    'google-drive': SvgGoogleDrive,
    'bot-builder': SvgBotBuilder,
    'quick-strategy': SvgQuickStrategy,
};

type TCardProps = {
    has_dashboard_strategies: boolean;
    is_mobile: boolean;
    children?: React.ReactNode;
};

type TCardArray = {
    type: string;
    icon: string;
    content: string;
    callback: () => void;
};

const Cards = observer(({ is_mobile, has_dashboard_strategies, children }: TCardProps) => {
    const cardIcons = {
        'my-computer': 'IcMyComputer',
        'google-drive': 'IcGoogleDriveDbot',
        'bot-builder': 'IcBotBuilder',
        'quick-strategy': 'IcQuickStrategy',
    };

    const cardDescriptions = {
        'my-computer': localize('Upload your bot from your device'),
        'google-drive': localize('Access your saved bots from Google Drive'),
        'bot-builder': localize('Build your bot from scratch with our visual editor'),
        'quick-strategy': localize('Use pre-built strategies to get started quickly'),
    };
    const { dashboard, load_modal, quick_strategy } = useDBotStore();
    const { toggleLoadModal, setActiveTabIndex } = load_modal;
    const { is_dialog_open, setActiveTab } = dashboard;
    const { setFormVisibility } = quick_strategy;

    const openGoogleDriveDialog = () => {
        toggleLoadModal();
        setActiveTabIndex(is_mobile ? 1 : 2);
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    const openFileLoader = () => {
        toggleLoadModal();
        setActiveTabIndex(is_mobile ? 0 : 1);
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    const actions: TCardArray[] = [
        {
            type: 'my-computer',
            icon: is_mobile ? 'IcLocal' : 'IcMyComputer',
            content: is_mobile ? localize('Local') : localize('My computer'),
            callback: () => {
                openFileLoader();
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'load_strategy',
                    load_strategy_tab: 'local',
                });
            },
        },
        {
            type: 'google-drive',
            icon: 'IcGoogleDriveDbot',
            content: localize('Google Drive'),
            callback: () => {
                openGoogleDriveDialog();
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'load_strategy',
                    load_strategy_tab: 'google drive',
                });
            },
        },
        {
            type: 'bot-builder',
            icon: 'IcBotBuilder',
            content: localize('Bot Builder'),
            callback: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                rudderStackSendDashboardClickEvent({
                    dashboard_click_name: 'bot_builder',
                    subpage_name: 'bot_builder',
                });
            },
        },
        {
            type: 'quick-strategy',
            icon: 'IcQuickStrategy',
            content: localize('Quick strategy'),
            callback: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                setFormVisibility(true);
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'quick_strategy',
                });
            },
        },
    ];

    return React.useMemo(
        () => (
            <div className='dashboard-cards'>
                <div className='dashboard-cards__socials'>
                    <a href="https://youtube.com/@danielmwangi3263?si=mXljcLwrAfDJmP2L" target="_blank" rel="noopener noreferrer"
                        className="social-icon youtube-icon"
                    >
                        <YouTubeIcon />
                    </a>
                    <a href="https://www.instagram.com/daniel_the_ceo_01?igsh=cmRnZHh6MHRibThy" target="_blank" rel="noopener noreferrer"
                        className="social-icon instagram-icon"
                    >
                        <InstagramIcon />
                    </a>
                    <a href="https://www.whatsapp.com/channel/0029Vb71CLFLtOj6rhqG1A3E" target="_blank" rel="noopener noreferrer"
                        className="social-icon whatsapp-icon"
                    >
                        <WhatsAppIcon />
                    </a>
                    <a href="https://www.tiktok.com/@danieltheceo01?_t=ZM-8z0BoHRxMve&_r=1" target="_blank" rel="noopener noreferrer"
                        className="social-icon tiktok-icon"
                    >
                        <TikTokIcon />
                    </a>
                    <a href="https://t.me/derihub" target="_blank" rel="noopener noreferrer"
                        className="social-icon telegram-icon"
                    >
                        <TelegramIcon />
                    </a>
                </div>
                <div className='dashboard-cards__grid'>
                    {actions.map((action) => (
                        <div
                            key={action.type}
                            className={classNames('dashboard-card dashboard-card--green', {
                                'dashboard-card--minimized': has_dashboard_strategies && is_mobile,
                            })}
                            onClick={action.callback}
                            onKeyDown={(e: React.KeyboardEvent) => {
                                if (e.key === 'Enter') {
                                    action.callback();
                                }
                            }}
                            tabIndex={0}
                        >
                            <div className='dashboard-card__icon'>
                                {(() => {
                                    const CustomIcon = customIcons[action.type];
                                    if (CustomIcon) return <CustomIcon width={is_mobile ? '32' : '40'} height={is_mobile ? '32' : '40'} />;
                                    return <Icon icon={action.icon} width={is_mobile ? '32' : '40'} height={is_mobile ? '32' : '40'} />;
                                })()}
                            </div>
                            <div className='dashboard-card__content'>
                                <Text
                                    as='h3'
                                    weight='bold'
                                    size={is_mobile ? 'xs' : 's'}
                                    line_height='m'
                                    className='dashboard-card__title'
                                >
                                    {action.content}
                                </Text>
                                <Text
                                    as='p'
                                    size={is_mobile ? 'xxs' : 'xs'}
                                    line_height='m'
                                    className='dashboard-card__description'
                                >
                                    {cardDescriptions[action.type as keyof typeof cardDescriptions]}
                                </Text>
                            </div>
                            <div className='dashboard-card__arrow'>
                                <Icon icon='IcChevronRight' size={16} />
                            </div>
                        </div>
                    ))}
                </div>
                {children}
                <DashboardBotList />
            </div>
        ),
        [is_dialog_open, has_dashboard_strategies, children, actions]
    );
});

export default Cards;
