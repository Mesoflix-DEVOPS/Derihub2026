import LZString from 'lz-string';
import localForage from 'localforage';
import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';

// Import bots from master folder
import AutoBotOsam from './master/Auto Bot by Osam💯.xml';
import EvenOddSwitcher from './master/Even Odd switcher .xml';
import EvenOddSwitcherII from './master/Even Odd Switcher II.xml';
import EvenOddMythV1 from './master/EVEN_ODD MYTH V1.xml';
import EvenOddMythV2 from './master/EVEN_ODD MYTH V2.xml';
import MegaMind2 from './master/mega mind 2.xml';
import MegaMind3 from './master/mega mind 3.xml';
import MegaMindV1 from './master/Mega_Mind V1👻.xml';
import OddMythV3 from './master/ODD_MYTH V3.0.xml';
import OsamHnR from './master/Osam HnR.xml';
import OsamDigitSwitcher from './master/Osam_Digit_Switcher🤖🤖.xml';
import OsamDigitTicker from './master/Osam_Digit_Ticker.xml';
import OverDestroyer from './master/Over-Destroyer💀.xml';
import OverProBot from './master/Over-Pro Bot💫.xml';
import OverHitnRun from './master/Over_HitnRun🤖.xml';
import TheAstroEO from './master/the Astro E_O🤖.xml';
import UnderDestroyer from './master/Under-Destroyer💀.xml';
import UnderProBot from './master/Under-Pro Bot💫.xml';
import UnderHitnRun from './master/Under_HitnRun.xml';
import UnderDestroyerV2 from './master/Under_Destroyer v2.xml';

// Ensure Blockly is available globally
const getBlockly = () => {
    if (typeof window !== 'undefined' && window.Blockly) {
        return window.Blockly;
    }
    throw new Error('Blockly not available - workspace not initialized');
};

// Static bot configurations - Master bots
const STATIC_BOTS = {
    auto_bot_osam: { id: 'auto_bot_osam', name: 'Auto Bot by Osam💯', xml: AutoBotOsam, timestamp: Date.now(), save_type: save_types.LOCAL },
    even_odd_switcher: { id: 'even_odd_switcher', name: 'Even Odd switcher', xml: EvenOddSwitcher, timestamp: Date.now(), save_type: save_types.LOCAL },
    even_odd_switcher_ii: { id: 'even_odd_switcher_ii', name: 'Even Odd Switcher II', xml: EvenOddSwitcherII, timestamp: Date.now(), save_type: save_types.LOCAL },
    even_odd_myth_v1: { id: 'even_odd_myth_v1', name: 'EVEN_ODD MYTH V1', xml: EvenOddMythV1, timestamp: Date.now(), save_type: save_types.LOCAL },
    even_odd_myth_v2: { id: 'even_odd_myth_v2', name: 'EVEN_ODD MYTH V2', xml: EvenOddMythV2, timestamp: Date.now(), save_type: save_types.LOCAL },
    mega_mind_2: { id: 'mega_mind_2', name: 'mega mind 2', xml: MegaMind2, timestamp: Date.now(), save_type: save_types.LOCAL },
    mega_mind_3: { id: 'mega_mind_3', name: 'mega mind 3', xml: MegaMind3, timestamp: Date.now(), save_type: save_types.LOCAL },
    mega_mind_v1: { id: 'mega_mind_v1', name: 'Mega_Mind V1👻', xml: MegaMindV1, timestamp: Date.now(), save_type: save_types.LOCAL },
    odd_myth_v3: { id: 'odd_myth_v3', name: 'ODD_MYTH V3.0', xml: OddMythV3, timestamp: Date.now(), save_type: save_types.LOCAL },
    osam_hnr: { id: 'osam_hnr', name: 'Osam HnR', xml: OsamHnR, timestamp: Date.now(), save_type: save_types.LOCAL },
    osam_digit_switcher: { id: 'osam_digit_switcher', name: 'Osam_Digit_Switcher🤖🤖', xml: OsamDigitSwitcher, timestamp: Date.now(), save_type: save_types.LOCAL },
    osam_digit_ticker: { id: 'osam_digit_ticker', name: 'Osam_Digit_Ticker', xml: OsamDigitTicker, timestamp: Date.now(), save_type: save_types.LOCAL },
    over_destroyer: { id: 'over_destroyer', name: 'Over-Destroyer💀', xml: OverDestroyer, timestamp: Date.now(), save_type: save_types.LOCAL },
    over_pro_bot: { id: 'over_pro_bot', name: 'Over-Pro Bot💫', xml: OverProBot, timestamp: Date.now(), save_type: save_types.LOCAL },
    over_hitnrun: { id: 'over_hitnrun', name: 'Over_HitnRun🤖', xml: OverHitnRun, timestamp: Date.now(), save_type: save_types.LOCAL },
    the_astro_eo: { id: 'the_astro_eo', name: 'the Astro E_O🤖', xml: TheAstroEO, timestamp: Date.now(), save_type: save_types.LOCAL },
    under_destroyer: { id: 'under_destroyer', name: 'Under-Destroyer💀', xml: UnderDestroyer, timestamp: Date.now(), save_type: save_types.LOCAL },
    under_pro_bot: { id: 'under_pro_bot', name: 'Under-Pro Bot💫', xml: UnderProBot, timestamp: Date.now(), save_type: save_types.LOCAL },
    under_hitnrun: { id: 'under_hitnrun', name: 'Under_HitnRun', xml: UnderHitnRun, timestamp: Date.now(), save_type: save_types.LOCAL },
    under_destroyer_v2: { id: 'under_destroyer_v2', name: 'Under_Destroyer v2', xml: UnderDestroyerV2, timestamp: Date.now(), save_type: save_types.LOCAL },
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