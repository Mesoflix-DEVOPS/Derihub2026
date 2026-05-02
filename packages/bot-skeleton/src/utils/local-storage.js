import LZString from 'lz-string';
import localForage from 'localforage';
import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';

// Import bots from master folder
import DerihubEvenOddMaster from './master/DERIHUB Even Odd Master.xml';
import DeriHubUnderTrader from './master/DeriHub_Under_Trader.xml';
import DigitSwitcherPro from './master/DigitSwitcherPro.xml';
import MasterPlugBotV1 from './master/MASTER PLUG BOT V1.xml';
import MasterPlugBotV2 from './master/MASTER PLUG BOT V2(1) (7).xml';
import OverAIPro from './master/Over AI pro.xml';
import OverKing from './master/OverKing.xml';
import OverProBot from './master/OverProBot.xml';


// Ensure Blockly is available globally
const getBlockly = () => {
    if (typeof window !== 'undefined' && window.Blockly) {
        return window.Blockly;
    }
    throw new Error('Blockly not available - workspace not initialized');
};

// Static bot configurations - Master bots
const STATIC_BOTS = {
    derihub_even_odd_master: { id: 'derihub_even_odd_master', name: 'DERIHUB Even Odd Master', xml: DerihubEvenOddMaster, timestamp: Date.now(), save_type: save_types.LOCAL },
    derihub_under_trader: { id: 'derihub_under_trader', name: 'DeriHub Under Trader', xml: DeriHubUnderTrader, timestamp: Date.now(), save_type: save_types.LOCAL },
    digit_switcher_pro: { id: 'digit_switcher_pro', name: 'Digit Switcher Pro', xml: DigitSwitcherPro, timestamp: Date.now(), save_type: save_types.LOCAL },
    master_plug_bot_v1: { id: 'master_plug_bot_v1', name: 'MASTER PLUG BOT V1', xml: MasterPlugBotV1, timestamp: Date.now(), save_type: save_types.LOCAL },
    master_plug_bot_v2: { id: 'master_plug_bot_v2', name: 'MASTER PLUG BOT V2', xml: MasterPlugBotV2, timestamp: Date.now(), save_type: save_types.LOCAL },
    over_ai_pro: { id: 'over_ai_pro', name: 'Over AI Pro', xml: OverAIPro, timestamp: Date.now(), save_type: save_types.LOCAL },
    over_king: { id: 'over_king', name: 'OverKing', xml: OverKing, timestamp: Date.now(), save_type: save_types.LOCAL },
    over_pro_bot: { id: 'over_pro_bot', name: 'Over-Pro Bot', xml: OverProBot, timestamp: Date.now(), save_type: save_types.LOCAL },
};

const getStaticBots = () => Object.values(STATIC_BOTS);

/**
 * 🔒 Disable saving bots
 */
export const saveWorkspaceToRecent = async () => {
    console.warn('[INFO] Saving disabled → Using static bots only.');
    const {
        load_modal: { updateListStrategies },
    } = DBotStore.instance;
    updateListStrategies(getStaticBots());
};

/**
 * ✅ Always return static bots
 */
export const getSavedWorkspaces = async () => {
    const bots = getStaticBots();
    console.log(
        '[DEBUG] Available static bots:',
        bots.map(bot => bot.id)
    );
    return bots;
};

/**
 * Load a bot by ID (from static list only)
 */
export const loadStrategy = async strategy_id => {
    console.log(`[DEBUG] Attempting to load bot: ${strategy_id}`);

    // Check for duplicate IDs
    const staticBots = getStaticBots();
    const duplicateIds = staticBots.filter((bot, index) => staticBots.findIndex(b => b.id === bot.id) !== index);

    if (duplicateIds.length > 0) {
        console.error(
            '[ERROR] Duplicate bot IDs found:',
            duplicateIds.map(b => b.id)
        );
    }

    const strategy = staticBots.find(bot => bot.id === strategy_id);

    if (!strategy) {
        console.error(
            `[ERROR] Bot with id "${strategy_id}" not found. Available bots:`,
            staticBots.map(b => b.id)
        );
        return false;
    }

    try {
        // Check if workspace is initialized
        if (!Blockly.derivWorkspace) {
            console.error('[ERROR] Blockly workspace not initialized');
            return false;
        }

        // Clear existing workspace first
        console.log('[DEBUG] Clearing existing workspace');
        Blockly.derivWorkspace.clear();

        const parser = new DOMParser();
        const xmlDom = parser.parseFromString(strategy.xml, 'text/xml').documentElement;

        // Check if XML is valid
        if (xmlDom.querySelector('parsererror')) {
            console.error('[ERROR] Invalid XML content for bot:', strategy_id);
            return false;
        }

        const convertedXml = convertStrategyToIsDbot(xmlDom);

        Blockly.Xml.domToWorkspace(convertedXml, Blockly.derivWorkspace);
        Blockly.derivWorkspace.current_strategy_id = strategy_id;

        console.log(`[SUCCESS] Loaded static bot: ${strategy.name} (ID: ${strategy_id})`);
        return true;
    } catch (error) {
        console.error('Error loading static bot:', error);
        return false;
    }
};

/**
 * 🔒 Disable removing bots
 */
export const removeExistingWorkspace = async () => {
    console.warn('[INFO] Remove disabled → Static bots only.');
    return false;
};

/**
 * Ensure xml has `is_dbot` flag
 */
export const convertStrategyToIsDbot = xml_dom => {
    if (!xml_dom) return;
    xml_dom.setAttribute('is_dbot', 'true');
    return xml_dom;
};

// 🧹 Clear storage & recents at startup
localStorage.removeItem('saved_workspaces');
localStorage.removeItem('recent_strategies');
console.log('[INFO] Cleared saved/recent bots → Static bots only.');