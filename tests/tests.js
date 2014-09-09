var C = CryptoJS;

(function () {
    var data = {};
    data.message = C.lib.WordArray.create([
        0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f,
        0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f
    ]);
    data.key = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);
    data.iv = C.lib.WordArray.create([0x30313233, 0x34353637, 0x38393a3b, 0x3c3d3e3f]);

    Tinytest.add('MeteorCryptoMode - CBC Encryptor', function (t) {
        // Compute expected
        var expected = data.message.clone();
        var aes = C.algo.AES.createEncryptor(data.key);

        // First block XORed with IV, then encrypted
        for (var i = 0; i < 4; i++) {
            expected.words[i] ^= data.iv.words[i];
        }
        aes.encryptBlock(expected.words, 0);

        // Subsequent blocks XORed with previous crypted block, then encrypted
        for (var i = 4; i < 8; i++) {
            expected.words[i] ^= expected.words[i - 4];
        }
        aes.encryptBlock(expected.words, 4);

        // Compute actual
        var actual = C.AES.encrypt(data.message, data.key, {
            iv: data.iv,
            mode: C.mode.CBC,
            padding: C.pad.NoPadding
        }).ciphertext;

        // Test
        t.equal(actual.toString(), expected.toString());
    });

    Tinytest.add('MeteorCryptoMode - CBC Decryptor', function (t) {
        var encrypted = C.AES.encrypt(data.message, data.key, {
            iv: data.iv,
            mode: C.mode.CBC,
            padding: C.pad.NoPadding
        });
        var decrypted = C.AES.decrypt(encrypted, data.key, {
            iv: data.iv,
            mode: C.mode.CBC,
            padding: C.pad.NoPadding
        });

        t.equal(decrypted.toString(), data.message.toString());
    });
}());

(function () {
    var data = {};

    data.message = C.lib.WordArray.create([
        0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f,
        0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f
    ]);
    data.key = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);
    data.iv = C.lib.WordArray.create([0x30313233, 0x34353637, 0x38393a3b, 0x3c3d3e3f]);

    Tinytest.add('MeteorCryptoMode - CFB Encryptor', function (t) {
        // Compute expected
        var expected = data.message.clone();
        var aes = C.algo.AES.createEncryptor(data.key);

        // First block XORed with encrypted IV
        var keystream = data.iv.words.slice(0);
        aes.encryptBlock(keystream, 0);
        for (var i = 0; i < 4; i++) {
            expected.words[i] ^= keystream[i];
        }

        // Subsequent blocks XORed with encrypted previous crypted block
        var keystream = expected.words.slice(0, 4);
        aes.encryptBlock(keystream, 0);
        for (var i = 4; i < 8; i++) {
            expected.words[i] ^= keystream[i % 4];
        }

        // Compute actual
        var actual = C.AES.encrypt(data.message, data.key, {
            iv: data.iv,
            mode: C.mode.CFB,
            padding: C.pad.NoPadding
        }).ciphertext;

        // Test
        t.equal(actual.toString(), expected.toString());
    });

    Tinytest.add('MeteorCryptoMode - CFB Decryptor', function (t) {
        var encrypted = C.AES.encrypt(data.message, data.key, {
            iv: data.iv,
            mode: C.mode.CFB,
            padding: C.pad.NoPadding
        });
        var decrypted = C.AES.decrypt(encrypted, data.key, {
            iv: data.iv,
            mode: C.mode.CFB,
            padding: C.pad.NoPadding
        });

        t.equal(decrypted.toString(), data.message.toString());
    });
}());

(function () {
    var data = {};
    data.message = C.lib.WordArray.create([
        0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f,
        0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f
    ]);
    data.key = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);
    data.iv = C.lib.WordArray.create([0x30313233, 0x34353637, 0x38393a3b, 0x3c3d3e3f]);

    Tinytest.add('MeteorCryptoMode - CTR Encryptor', function (t) {
        // Compute expected
        var expected = data.message.clone();
        var aes = C.algo.AES.createEncryptor(data.key);

        // Counter initialized with IV
        var counter = data.iv.words.slice(0);

        // First block XORed with encrypted counter
        var keystream = counter.slice(0);
        aes.encryptBlock(keystream, 0);
        for (var i = 0; i < 4; i++) {
            expected.words[i] ^= keystream[i];
        }

        // Subsequent blocks XORed with encrypted incremented counter
        counter[3]++;
        var keystream = counter.slice(0);
        aes.encryptBlock(keystream, 0);
        for (var i = 4; i < 8; i++) {
            expected.words[i] ^= keystream[i % 4];
        }

        // Compute actual
        var actual = C.AES.encrypt(data.message, data.key, {
            iv: data.iv,
            mode: C.mode.CTR,
            padding: C.pad.NoPadding
        }).ciphertext;

        // Test
        t.equal(actual.toString(), expected.toString());
    });

    Tinytest.add('MeteorCryptoMode - CTR Decryptor', function (t) {
        var encrypted = C.AES.encrypt(data.message, data.key, {
            iv: data.iv,
            mode: C.mode.CTR,
            padding: C.pad.NoPadding
        });
        var decrypted = C.AES.decrypt(encrypted, data.key, {
            iv: data.iv,
            mode: C.mode.CTR,
            padding: C.pad.NoPadding
        });

        t.equal(decrypted.toString(), data.message.toString());
    });
}());

(function () {
    var data = {};

    data.message = C.lib.WordArray.create([
        0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f,
        0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f
    ]);
    data.key = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);

    Tinytest.add('MeteorCryptoMode - ECB Encryptor', function (t) {
        // Compute expected
        var expected = data.message.clone();
        var aes = C.algo.AES.createEncryptor(data.key);
        aes.encryptBlock(expected.words, 0);
        aes.encryptBlock(expected.words, 4);

        // Compute actual
        var actual = C.AES.encrypt(data.message, data.key, {
            mode: C.mode.ECB,
            padding: C.pad.NoPadding
        }).ciphertext;

        // Test
        t.equal(actual.toString(), expected.toString());
    });

    Tinytest.add('MeteorCryptoMode - ECB Decryptor', function (t) {
        var encrypted = C.AES.encrypt(data.message, data.key, {
            mode: C.mode.ECB,
            padding: C.pad.NoPadding
        });
        var decrypted = C.AES.decrypt(encrypted, data.key, {
            mode: C.mode.ECB,
            padding: C.pad.NoPadding
        });

        t.equal(decrypted.toString(), data.message.toString());
    });
}());

(function () {
    var data = {};

    data.message = C.lib.WordArray.create([
        0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f,
        0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f
    ]);
    data.key = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);
    data.iv = C.lib.WordArray.create([0x30313233, 0x34353637, 0x38393a3b, 0x3c3d3e3f]);

    Tinytest.add('MeteorCryptoMode - OFB Encryptor', function (t) {
        // Compute expected
        var expected = data.message.clone();
        var aes = C.algo.AES.createEncryptor(data.key);

        // First block XORed with encrypted IV
        var keystream = data.iv.words.slice(0);
        aes.encryptBlock(keystream, 0);
        for (var i = 0; i < 4; i++) {
            expected.words[i] ^= keystream[i];
        }

        // Subsequent blocks XORed with encrypted previous keystream
        aes.encryptBlock(keystream, 0);
        for (var i = 4; i < 8; i++) {
            expected.words[i] ^= keystream[i % 4];
        }

        // Compute actual
        var actual = C.AES.encrypt(data.message, data.key, {
            iv: data.iv,
            mode: C.mode.OFB,
            padding: C.pad.NoPadding
        }).ciphertext;

        // Test
        t.equal(actual.toString(), expected.toString());
    });

    Tinytest.add('MeteorCryptoMode - OFB Decryptor', function (t) {
        var encrypted = C.AES.encrypt(data.message, data.key, {
            iv: data.iv,
            mode: C.mode.OFB,
            padding: C.pad.NoPadding
        });
        var decrypted = C.AES.decrypt(encrypted, data.key, {
            iv: data.iv,
            mode: C.mode.OFB,
            padding: C.pad.NoPadding
        });

        t.equal(decrypted.toString(), data.message.toString());
    });
}());