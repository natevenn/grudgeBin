const EventEmitter = require('events')

let grudges = [];

const grudgeBin = new EventEmitter();

const storedGrudges = localStorage.getItem('grudges');
if (storedGrudges) { grudges = JSON.parse(storedGrudges); }

grudgeBin.all = () => grudges.concat([]);

grudgeBin.create = ({ person, grudge }) => {
    grudges = grudges.concat({ person, grudge, forgiven: false, id: Date.now() });
    grudgeBin.emit('change', grudges);
};

grudgeBin.forgive = (id) => {
    grudges = grudges.map(grudge => {
        if(grudge.id !== id) {
            return grudge;
        } else {
            grudge.forgiven = true;
            return grudge;
        }
    });
    grudgeBin.emit('change', grudges);
};

grudgeBin.forgiven = () => {
    return grudges.filter(grudge => grudge.forgiven === true);

}

grudgeBin.unforgiven = () => {
    return grudges.filter(grudge => grudge.forgiven === false);
}

grudgeBin.on('change', () => {
    localStorage.setItem('grudges', JSON.stringify(grudges));
});

module.exports = grudgeBin;
