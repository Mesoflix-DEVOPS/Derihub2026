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
