import { globalShortcut } from 'electron';

// Extract the same action
function routing(wins: Object, carrier: string, todo: string) {
    return () => wins[carrier].webContents.send(todo);
}


const registerShortcut = (wins: Object) => {

    // Send message to BlockContainer with channel 'full-snip' 
    globalShortcut.register('Shift+F1', routing(wins, "homeWin", "full-snip"))

    // Send message to Block Container with channel 'open-text-win'
    globalShortcut.register('Shift+F2', routing(wins, "homeWin", "open-text-win"));

    // Send message to Block Container with channel 'drag-snip'
    globalShortcut.register('Shift+F3', routing(wins, "homeWin", "drag-snip"))

    // Send message to Block Container with channel 'record-audio'
    globalShortcut.register('Shift+F4', routing(wins, "homeWin", "record-audio"))

    // Send message to Block Container with channel 'record-audio'
    globalShortcut.register('Shift+F5', routing(wins, "homeWin", "record-video"))
}

const unregisterShortcut = (wins: Object) => {
    globalShortcut.unregisterAll();

    // Let user always send message to control bar window with channel 'Ctrl+Shift+s'.
    globalShortcut.register('Ctrl+Shift+s', routing(wins, "controlbarWin", "Ctrl+Shift+s"))
}

export { registerShortcut, unregisterShortcut };
