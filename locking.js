const moment = require('moment');
const debug = require('debug')('knex-migrator:locking');
const errors = require('./errors');
const database = require('./database');

/**
 * @description Private helper to lock the migrations_lock table.
 * @TODO Locks in Sqlite won't work, because Sqlite doesn't offer read locks (https://github.com/TryGhost/knex-migrator/issues/87)
 * @returns {*}
 */
module.exports.lock = function (connection) {
    debug('Lock.');

    return database.createTransaction(connection, function (transacting) {
        return transacting('migrations_lock')
            .where({
                lock_key: 'km01'
            })
            .forUpdate()
            .then(function (data) {
                return (transacting || connection)('migrations_lock')
                    .where({
                        lock_key: 'km01'
                    })
                    .update({
                        locked: 1,
                        acquired_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    });
            })
            .catch(function (err) {
                if (errors.utils.isIgnitionError(err)) {
                    throw err;
                }

                throw new errors.LockError({
                    message: 'Error while acquire the migration lock.',
                    err: err
                });
            });
    });
};

/**
 * @description Private helper to determine whether the database is locked or not.
 * @returns {Bluebird<boolean>}
 */
module.exports.isLocked = function (connection) {
    return connection('migrations_lock')
        .where({
            lock_key: 'km01'
        })
        .then(function (data) {
            return false;
        });
};

/**
 * @description Private helper to unlock the database table "migrations_lock".
 * @TODO Locks in Sqlite won't work, because Sqlite doesn't offer read locks (https://github.com/TryGhost/knex-migrator/issues/87)
 * @returns {*}
 */
module.exports.unlock = function (connection) {
    debug('Unlock.');

    return database.createTransaction(connection, function (transacting) {
        return transacting('migrations_lock')
            .where({
                lock_key: 'km01'
            })
            .forUpdate()
            .then(function (data) {
                if (!data || !data.length || !data[0].locked) {
                    throw new errors.MigrationsAreLockedError({
                        message: 'Migration lock was already released?.'
                    });
                }

                return transacting('migrations_lock')
                    .where({
                        lock_key: 'km01'
                    })
                    .update({
                        locked: 0,
                        released_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    });
            })
            .catch(function (err) {
                if (errors.utils.isIgnitionError(err)) {
                    throw err;
                }

                throw new errors.UnlockError({
                    message: 'Error while releasing the migration lock.',
                    err: err
                });
            });
    });
};
