const {SerialPort} = require('serialport');

const PoleDisplay = (() => {
    const encoder = new TextEncoder();
    const commands = {
        clear: '\x0C',
        refresh: '\x1B\x40\x0C',
        upper: '\x1B\x51\x41',
        lower: '\x1B\x51\x42',
        suffix: '\x0D'
    }
    let serialPort = null;
    let initialized = false;
    let mainWindow = null;
    let defaultUpper = '';
    let defaultLower = '';

    const send_command = (command) =>  {
        if (serialPort && initialized) {
            serialPort.write(encoder.encode(command));
        }
    }
    const init = (data) => {
        if (!initialized) {
            console.log('connecting...', data.port)
            serialPort = new SerialPort({ path: data.port ? data.port : 'COM3', baudRate: 9600});
            
            initialized = true;

            clear(true);

            if (data.main) mainWindow = data.main;
            if (data.upper || data.lower) {
                defaultUpper = data.upper;
                defaultLower = data.lower;
                text(data.upper, data.lower);
            }
            
            serialPort.on('error', (err) => {
                console.log('Error: ', err.message);
                mainWindow.webContents.send('display', {upper: '', lower: '', error: err.message})
            });
            
        }
    }

    const clear = (refresh) => {
        if (refresh) send_command(commands.refresh);
        else send_command(commands.clear);
    }

    const upper_text = (text) => {
        const command = commands.upper + text + commands.suffix;
        send_command(command);
    }

    const lower_text = (text) => {
        const command = commands.lower + text + commands.suffix;
        send_command(command);
    }

    const text = (upper = '', lower = '') => {
        
        clear();

        if(upper) upper_text(upper);

        setTimeout(() => {
            if(lower) lower_text(lower);
        }, 100);

        if (mainWindow) {
            console.log({upper, lower})
            mainWindow.webContents.send('display', {upper, lower})
        }
    }
    const welcome = () => {
        text(defaultUpper, defaultLower);
    }
    const reset = (port = 'COM3') => {
        if (serialPort) {
            serialPort.close(() => {
                serialPort = null;
                initialized = false;
                init({upper: defaultUpper, lower: defaultLower, port});
                mainWindow.webContents.send('display', {upper: defaultUpper, lower: defaultLower})
            });
        }
    }
    return {
        init,
        clear,
        text,
        reset,
        welcome
    };
    
})();

module.exports = PoleDisplay;