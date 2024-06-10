const fs = require('fs');

const store = {
    path: "/store.json",
    setStorePath: (storePath) => {
        this.path = storePath;
        console.log(this.path);
        try {
            if (!fs.existsSync(this.path)) {
                fs.writeFileSync(this.path, JSON.stringify({port: "COM3"}, null, 4));
            }
        } catch (error) {
            console.log("Store Init Issue: ", error);
        }
    },
    get: (k) => {
        try {
            const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            if (data[k]) return data[k];
            else return '';
        } catch (error) {
            console.log(error.message);
            return '';
        }

    },
    set: (k, v = '') => {
        if (k) {
            try {
                const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
                data[k] = v;
                fs.writeFileSync(this.path, JSON.stringify(data));
            } catch (error) {
                console.log(error.message)
            }
        }
    }
}

module.exports = store;