// ============================================================
// DEMO HUNTER
// ACTIVE WAVE + ROBUST AUDIO VERSION
// ============================================================

// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL =
    "https://hjrapdkhissblmatdcor.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_fVDUirdnqU167U8CgiD1LA_Nh9GVltj";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ============================================================
// CANVAS
// ============================================================

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d", {
        alpha: true
    });

if (!ctx) {
    throw new Error(
        "Canvas could not be initialized."
    );
}

ctx.imageSmoothingEnabled = false;


// ============================================================
// GAME VIDEO
// ============================================================

const gameVideo =
    document.getElementById("gameVideo");


// ============================================================
// DOM
// ============================================================

const mainMenu =
    document.getElementById("mainMenu");

const loginVideo =
    document.getElementById("loginVideo");

const readyScreen =
    document.getElementById("readyScreen");

const readyName =
    document.getElementById("readyName");

const readyText =
    document.getElementById("readyText");

const countdown =
    document.getElementById("countdown");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const arcadeSidebar =
    document.getElementById("arcadeSidebar");

const hunterNameInput =
    document.getElementById("hunterName");

const nameError =
    document.getElementById("nameError");

const damageFlash =
    document.getElementById("damageFlash");

const waveAnnouncement =
    document.getElementById("waveAnnouncement");

const waveAnnouncementNumber =
    document.getElementById(
        "waveAnnouncementNumber"
    );

const killsElement =
    document.getElementById("kills");

const timeElement =
    document.getElementById("time");

const livesElement =
    document.getElementById("lives");

const hunterElement =
    document.getElementById(
        "hudHunterName"
    );

const waveElement =
    document.getElementById("wave");

const deathTitle =
    document.getElementById("deathTitle");

const finalKills =
    document.getElementById("finalKills");

const finalTime =
    document.getElementById("finalTime");

const finalWave =
    document.getElementById("finalWave");

const leaderboardButton =
    document.getElementById(
        "leaderboardButton"
    );

const leaderboardScreen =
    document.getElementById(
        "leaderboardScreen"
    );

const leaderboardRows =
    document.getElementById(
        "leaderboardRows"
    );

const leaderboardStatus =
    document.getElementById(
        "leaderboardStatus"
    );

const closeLeaderboard =
    document.getElementById(
        "closeLeaderboard"
    );


// ============================================================
// AUDIO
// ============================================================

const bgm =
    new Audio("assets/bgm.mp3");

bgm.loop = true;
bgm.volume = 0.42;

bgm.preload = "auto";


/*
    IMPORTANT:
    These are used as SOURCE FILES.
    A fresh Audio object is created
    for every life-loss event.
*/

const LIFE_LOST_SRC =
    "assets/lifelost.mp3";

const GAME_LOST_SRC =
    "assets/lost.mp3";


// Gun pool

const gunSounds = [];

for (
    let i = 0;
    i < 6;
    i++
) {

    const gun =
        new Audio("assets/gun.mp3");

    gun.preload = "auto";

    gun.volume = 0.035;

    gunSounds.push(gun);

}

let gunIndex = 0;


// ============================================================
// AUDIO PRELOAD
// ============================================================

function preloadAudio(src) {

    const audio =
        new Audio();

    audio.src = src;

    audio.preload = "auto";

    audio.load();

    return audio;

}

const lifeAudioPreload =
    preloadAudio(
        LIFE_LOST_SRC
    );

const lostAudioPreload =
    preloadAudio(
        GAME_LOST_SRC
    );


// ============================================================
// ROBUST ONE-SHOT AUDIO
// ============================================================

function playOneShot(
    source,
    volume
) {

    try {

        const audio =
            new Audio(source);

        audio.volume =
            volume;

        audio.preload =
            "auto";

        /*
            load before playback.
        */

        audio.load();


        const promise =
            audio.play();


        if (
            promise &&
            typeof promise.catch ===
            "function"
        ) {

            promise.catch(
                error => {

                    console.warn(
                        "Audio playback blocked:",
                        source,
                        error
                    );

                }
            );

        }


        /*
            Clean up.
        */

        audio.addEventListener(
            "ended",
            () => {

                audio.src = "";

            },
            {
                once: true
            }
        );


        return audio;

    }
    catch (error) {

        console.error(
            "Could not play audio:",
            source,
            error
        );

        return null;

    }

}


// ============================================================
// AUDIO UNLOCK
// ============================================================

function unlockAudio() {

    /*
        The PLAY button is a user gesture.
        We use it to prepare all audio.
    */

    try {

        bgm.load();

    }
    catch (error) {}


    gunSounds.forEach(
        sound => {

            try {
                sound.load();
            }
            catch (error) {}

        }
    );


    try {

        lifeAudioPreload.load();

    }
    catch (error) {}


    try {

        lostAudioPreload.load();

    }
    catch (error) {}

}


// ============================================================
// PLAY LIFE LOST
// ============================================================

function playLifeLostSound() {

    playOneShot(
        LIFE_LOST_SRC,
        0.72
    );

}


// ============================================================
// PLAY FINAL LOST
// ============================================================

function playFinalLostSound() {

    playOneShot(
        GAME_LOST_SRC,
        0.90
    );

}


// ============================================================
// MUSIC
// ============================================================

function startMusic() {

    try {

        bgm.pause();

        bgm.currentTime = 0;

        bgm.volume = 0.42;


        const promise =
            bgm.play();


        if (
            promise &&
            typeof promise.catch ===
            "function"
        ) {

            promise.catch(
                error => {

                    console.warn(
                        "BGM blocked:",
                        error
                    );

                }
            );

        }

    }
    catch (error) {}

}


function stopMusic() {

    try {

        bgm.pause();

        bgm.currentTime = 0;

    }
    catch (error) {}

}


// ============================================================
// GUN SOUND
// ============================================================

function playGunSound() {

    const sound =
        gunSounds[gunIndex];


    gunIndex =
        (
            gunIndex + 1
        ) %
        gunSounds.length;


    try {

        sound.pause();

        sound.currentTime = 0;

        sound.volume = 0.035;


        const promise =
            sound.play();


        if (
            promise &&
            typeof promise.catch ===
            "function"
        ) {

            promise.catch(
                () => {}
            );

        }

    }
    catch (error) {}

}


function stopAllGunSounds() {

    gunSounds.forEach(
        sound => {

            try {

                sound.pause();

                sound.currentTime = 0;

            }
            catch (error) {}

        }
    );

}


// ============================================================
// GAME VIDEO
// ============================================================

function startGameVideo() {

    if (!gameVideo) {
        return;
    }


    gameVideo.classList.remove(
        "hidden"
    );


    gameVideo.style.display =
        "block";

    gameVideo.style.visibility =
        "visible";

    gameVideo.style.opacity =
        "1";

    gameVideo.style.zIndex =
        "1";


    try {

        gameVideo.currentTime = 0;

    }
    catch (error) {}


    try {

        const promise =
            gameVideo.play();


        if (
            promise &&
            typeof promise.catch ===
            "function"
        ) {

            promise.catch(
                () => {}
            );

        }

    }
    catch (error) {}

}


function stopGameVideo() {

    if (!gameVideo) {
        return;
    }


    try {

        gameVideo.pause();

    }
    catch (error) {}


    gameVideo.style.display =
        "none";

    gameVideo.classList.add(
        "hidden"
    );

}


// ============================================================
// STATE
// ============================================================

let gameRunning = false;

let hunterName = "";

let kills = 0;

let lives = 3;

let survivalTime = 0;

let wave = 1;

let previousWave = 1;

let enemySpawnTimer = 0;

let lastTimestamp = 0;

let animationFrameId = null;

let readyTimer = null;

let fireTimer = null;

let damageCooldown = 0;

let deathPending = false;

let shakeTime = 0;

let muzzleFlashTime = 0;

let waveAnnouncementTimer = null;


// ============================================================
// PLAYER
// ============================================================

const player = {

    x: 0,

    y: 0,

    width: 110,

    height: 170,

    speed: 8

};


// ============================================================
// OBJECTS
// ============================================================

const bullets = [];

const enemies = [];

const particles = [];


// ============================================================
// CONTROLS
// ============================================================

const keys = {

    left: false,

    right: false

};


function isTypingTarget(
    element
) {

    if (!element) {
        return false;
    }


    const tag =
        element.tagName
            ? element.tagName.toLowerCase()
            : "";


    return (

        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        element.isContentEditable

    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            isTypingTarget(
                event.target
            )
        ) {

            return;

        }


        const key =
            event.key.toLowerCase();


        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            keys.left = true;

            event.preventDefault();

        }


        if (
            key === "d" ||
            key === "arrowright"
        ) {

            keys.right = true;

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        if (
            isTypingTarget(
                event.target
            )
        ) {

            return;

        }


        const key =
            event.key.toLowerCase();


        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            keys.left = false;

        }


        if (
            key === "d" ||
            key === "arrowright"
        ) {

            keys.right = false;

        }

    }
);


// ============================================================
// RESIZE
// ============================================================

function getSidebarWidth() {

    const value =
        getComputedStyle(
            document.documentElement
        )
        .getPropertyValue(
            "--sidebar-width"
        );


    return (
        parseFloat(value) || 260
    );

}


function resizeCanvas() {

    const width =
        Math.max(
            500,
            window.innerWidth -
            getSidebarWidth()
        );


    canvas.width =
        width;

    canvas.height =
        Math.max(
            400,
            window.innerHeight
        );


    player.y =
        canvas.height - 180;


    if (
        player.x < 0
    ) {

        player.x = 0;

    }


    if (
        player.x +
        player.width >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width;

    }

}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();


// ============================================================
// PLAYER MOVEMENT
// ============================================================

function updatePlayer() {

    if (keys.left) {

        player.x -=
            player.speed;

    }


    if (keys.right) {

        player.x +=
            player.speed;

    }


    if (
        player.x < 0
    ) {

        player.x = 0;

    }


    if (
        player.x +
        player.width >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width;

    }

}


// ============================================================
// WAVES
// ============================================================

function calculateWave() {

    /*
        New wave every 20 seconds.
    */

    return (
        Math.floor(
            survivalTime / 20
        ) + 1
    );

}


function getWaveProgress() {

    return (
        survivalTime % 20
    ) / 20;

}


function getSpawnInterval() {

    /*
        Faster reinforcement.

        Early game:
        ~800 ms

        Mid game:
        ~600 ms

        Later:
        approaches 300 ms
    */

    const progressiveReduction =
        survivalTime * 8;


    return Math.max(

        300,

        800 -
        progressiveReduction

    );

}


function getDifficulty() {

    /*
        Progressive difficulty.

        Wave 1:
        Manageable.

        Wave 2:
        Faster.

        Wave 3:
        Noticeable pressure.

        Wave 4+:
        Hard.

        Later:
        Very hard.
    */

    return Math.min(

        0.95 +
        (wave - 1) * 0.15 +
        survivalTime / 400,

        2.20

    );

}


// ============================================================
// ENEMY LIMIT
// ============================================================

function getEnemyLimit() {

    /*
        More enemies as waves increase.

        Wave 1: 7
        Wave 2: 9
        Wave 3: 10
        Wave 4: 12
        Wave 5: 13
        Wave 6: 15
        Wave 7+: 17
    */

    return Math.min(

        7 +
        Math.floor(
            (wave - 1) * 1.35
        ),

        17

    );

}


// ============================================================
// BURST SIZE
// ============================================================

function getBurstSize() {

    /*
        Wave 1:
        2 enemies

        Wave 2:
        2-3 enemies

        Wave 3:
        3-4 enemies

        Wave 4+:
        4-5 enemies
    */

    if (
        wave === 1
    ) {

        return 2;

    }


    if (
        wave === 2
    ) {

        return (
            Math.random() < 0.40
                ? 3
                : 2
        );

    }


    if (
        wave <= 3
    ) {

        return (
            Math.random() < 0.50
                ? 4
                : 3
        );

    }


    return (
        Math.random() < 0.35
            ? 5
            : 4
    );

}

// ============================================================
// WAVE ANNOUNCEMENT
// ============================================================

function showWaveAnnouncement(
    waveNumber
) {

    if (
        !waveAnnouncement
    ) {

        return;

    }


    if (
        waveAnnouncementTimer
    ) {

        clearTimeout(
            waveAnnouncementTimer
        );

    }


    waveAnnouncementNumber.textContent =
        `WAVE ${String(
            waveNumber
        ).padStart(
            2,
            "0"
        )}`;


    waveAnnouncement.classList.remove(
        "hidden"
    );


    waveAnnouncement.classList.remove(
        "show"
    );


    void waveAnnouncement.offsetWidth;


    waveAnnouncement.classList.add(
        "show"
    );


    waveAnnouncementTimer =
        setTimeout(
            () => {

                waveAnnouncement.classList.add(
                    "hidden"
                );

            },
            1250
        );

}


// ============================================================
// ENEMY SPAWN
// ============================================================

function spawnEnemy() {

    if (
        enemies.length >=
        getEnemyLimit()
    ) {

        return;

    }


    const size =
        78 +
        Math.random() * 16;


    enemies.push({

        x:
            Math.random() *
            Math.max(
                1,
                canvas.width -
                size
            ),

        y:
            -size -
            Math.random() * 120,

        width:
            size,

        height:
            size * 1.22,

        baseSpeed:
            0.75 +
            Math.random() * 0.20,

                drift:
            (
                Math.random() -
                0.5
            ) * 0.85,

        phase:
            Math.random() *
            Math.PI *
            2,

        animation:
            Math.random() *
            1000

    });

}


// ============================================================
// SPAWN BURST
// ============================================================

function spawnBurst() {

    const available =
        getEnemyLimit() -
        enemies.length;


    if (
        available <= 0
    ) {

        return;

    }


    const desired =
        getBurstSize();


    const amount =
        Math.min(
            desired,
            available
        );


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        spawnEnemy();

    }

}


// ============================================================
// ENEMY UPDATE
// ============================================================

function updateEnemies(
    deltaTime
) {

    enemySpawnTimer +=
        deltaTime;


    const newWave =
        calculateWave();


    if (
        newWave !==
        previousWave
    ) {

        previousWave =
            newWave;

        wave =
            newWave;


        showWaveAnnouncement(
            wave
        );


        /*
            Immediate reinforcement
            when wave changes.
        */

        spawnBurst();

        spawnBurst();

    }


    if (
        enemySpawnTimer >=
        getSpawnInterval()
    ) {

        spawnBurst();

        enemySpawnTimer = 0;

    }


    const difficulty =
        getDifficulty();


    const multiplier =
        deltaTime /
        16.67;


    for (
        let i =
            enemies.length - 1;

        i >= 0;

        i--
    ) {

        const enemy =
            enemies[i];


        enemy.animation +=
            deltaTime;


        enemy.x +=
            enemy.drift *
            multiplier;


        enemy.x +=
            Math.sin(
                survivalTime * 1.2 +
                enemy.phase
            ) *
            0.16 *
            multiplier;


        enemy.y +=
            enemy.baseSpeed *
            difficulty *
            multiplier;


        if (
            enemy.x < -20
        ) {

            enemy.x = -20;

            enemy.drift =
                Math.abs(
                    enemy.drift
                );

        }


        if (
            enemy.x +
            enemy.width >
            canvas.width + 20
        ) {

            enemy.x =
                canvas.width -
                enemy.width +
                20;

            enemy.drift =
                -Math.abs(
                    enemy.drift
                );

        }


        if (
            checkPlayerCollision(
                enemy
            )
        ) {

            enemies.splice(
                i,
                1
            );


            loseLife();


            continue;

        }


        if (
            enemy.y +
            enemy.height >=
            canvas.height - 20
        ) {

            enemies.splice(
                i,
                1
            );


            loseLife();

        }

    }

}


// ============================================================
// PLAYER COLLISION
// ============================================================

function checkPlayerCollision(
    enemy
) {

    const hitbox = {

        x:
            player.x + 25,

        y:
            player.y + 35,

        width:
            player.width - 48,

        height:
            player.height - 38

    };


    return (

        enemy.x <
        hitbox.x +
        hitbox.width &&

        enemy.x +
        enemy.width >
        hitbox.x &&

        enemy.y <
        hitbox.y +
        hitbox.height &&

        enemy.y +
        enemy.height >
        hitbox.y

    );

}


// ============================================================
// COLLISION
// ============================================================

function rectangleCollision(
    a,
    b
) {

    return (

        a.x <
        b.x +
        b.width &&

        a.x +
        a.width >
        b.x &&

        a.y <
        b.y +
        b.height &&

        a.y +
        a.height >
        b.y

    );

}


// ============================================================
// BULLETS
// ============================================================

function shoot() {

    if (
        !gameRunning ||
        deathPending
    ) {

        return;

    }


    /*
        RIGHT GUN
        Fires mostly straight upward.
    */

    bullets.push({

        x:
            player.x +
            player.width * 0.81,

        y:
            player.y - 5,

        width: 4,

        height: 13,

        speed: 15,

        dx: 0

    });


    /*
        LEFT GUN
        Fires diagonally toward the
        left side of the screen.
    */

    bullets.push({

        x:
            player.x +
            player.width * 0.19,

        y:
            player.y - 5,

        width: 4,

        height: 13,

        speed: 15,

        dx: -4.5

    });


    /*
        ONE shooting action = ONE sound.
        This prevents the dual guns from
        doubling the gun audio.
    */

    playGunSound();

    muzzleFlashTime = 60;

}


function startAutomaticFire() {

    stopAutomaticFire();


    shoot();


    fireTimer =
        setInterval(
            shoot,
            260 
        );

}


function stopAutomaticFire() {

    if (
        fireTimer !== null
    ) {

        clearInterval(
            fireTimer
        );

        fireTimer = null;

    }

}


function updateBullets(
    deltaTime
) {

    const multiplier =
        deltaTime / 16.67;


    for (
        let i =
            bullets.length - 1;

        i >= 0;

        i--
    ) {

        /*
            Vertical movement
        */

        bullets[i].y -=
            bullets[i].speed *
            multiplier;


        /*
            Horizontal movement
            Only the left gun has dx.
        */

        bullets[i].x +=
            (bullets[i].dx || 0) *
            multiplier;


        /*
            Remove bullets that leave
            the screen.
        */

        if (
            bullets[i].y < -40 ||
            bullets[i].x < -40 ||
            bullets[i].x > canvas.width + 40
        ) {

            bullets.splice(
                i,
                1
            );

        }

    }

}


function checkBulletCollisions() {

    for (
        let i =
            bullets.length - 1;

        i >= 0;

        i--
    ) {

        for (
            let j =
                enemies.length - 1;

        j >= 0;

        j--
        ) {

            if (
                rectangleCollision(
                    bullets[i],
                    enemies[j]
                )
            ) {

                const hitX =
                    enemies[j].x +
                    enemies[j].width /
                    2;


                const hitY =
                    enemies[j].y +
                    enemies[j].height /
                    2;


                bullets.splice(
                    i,
                    1
                );


                enemies.splice(
                    j,
                    1
                );


                kills++;


                createHitParticles(
                    hitX,
                    hitY
                );


                break;

            }

        }

    }

}


// ============================================================
// LIFE SYSTEM
// ============================================================

function loseLife() {

    if (
        !gameRunning ||
        deathPending ||
        damageCooldown > 0
    ) {

        return;

    }


    damageCooldown =
        500;


    lives--;


    shakeTime =
        190;


    createDamageParticles();


    triggerDamageFlash();


    /*
        First and second life loss:
        lifelost.mp3
    */

    if (
        lives > 0
    ) {

        playLifeLostSound();

        updateHUD();

        return;

    }


    /*
        Third life:
        lost.mp3
    */

    deathPending =
        true;


    playFinalLostSound();


    stopAutomaticFire();

    stopAllGunSounds();


    updateHUD();


    /*
        Allow the final audio to
        actually be heard before
        showing the result screen.
    */

    setTimeout(
        endGame,
        1200
    );

}


// ============================================================
// TIMER
// ============================================================

function updateTimer(
    deltaTime
) {

    survivalTime +=
        deltaTime / 1000;


    wave =
        calculateWave();


    if (
        damageCooldown > 0
    ) {

        damageCooldown -=
            deltaTime;

    }

}


// ============================================================
// DAMAGE
// ============================================================

function triggerDamageFlash() {

    damageFlash.classList.remove(
        "active"
    );


    void damageFlash.offsetWidth;


    damageFlash.classList.add(
        "active"
    );

}


// ============================================================
// PIXEL DRAW
// ============================================================

function pRect(
    context,
    x,
    y,
    width,
    height,
    color
) {

    context.fillStyle =
        color;


    context.fillRect(

        Math.round(x),

        Math.round(y),

        Math.max(
            1,
            Math.round(width)
        ),

        Math.max(
            1,
            Math.round(height)
        )

    );

}


// ============================================================
// PLAYER SPRITE
// ============================================================

function createPlayerSprite() {

    const width =
        72;

    const height =
        102;


    const sprite =
        document.createElement(
            "canvas"
        );


    sprite.width =
        width;

    sprite.height =
        height;


    const s =
        sprite.getContext(
            "2d"
        );


    s.imageSmoothingEnabled =
        false;


    const outline = "#101113";

    const hairDark = "#241a17";
    const hair = "#4a3028";
    const hairLight = "#69463a";

    const skinShadow = "#8b5c49";
    const skin = "#c98c6d";
    const skinLight = "#dfa281";

    const glasses = "#111214";
    const glassHighlight = "#35383a";

    const jacketDark = "#394047";
    const jacket = "#69747b";
    const jacketLight = "#89939a";

    const shirt = "#1b2026";

    const jeansDark = "#1b3040";
    const jeans = "#31536b";
    const jeansLight = "#426a82";

    const glove = "#d6b928";
    const gloveLight = "#e6d052";

    const backpack = "#171c20";

    const rifle = "#1c1a19";
    const rifleMetal = "#57504a";
    const rifleWood = "#604934";


    // Backpack

    pRect(s, 10, 29, 11, 42, backpack);
    pRect(s, 51, 29, 11, 42, backpack);


    // Hair

    pRect(s, 23, 5, 27, 7, outline);
    pRect(s, 19, 10, 35, 18, outline);
    pRect(s, 22, 7, 29, 17, hair);
    pRect(s, 24, 5, 9, 8, hairDark);
    pRect(s, 34, 4, 9, 8, hairLight);
    pRect(s, 44, 7, 8, 8, hair);
    pRect(s, 19, 14, 5, 12, hairDark);
    pRect(s, 50, 13, 5, 11, hairDark);


    // Face

    pRect(s, 25, 15, 25, 20, skinShadow);
    pRect(s, 27, 17, 21, 16, skin);
    pRect(s, 29, 18, 17, 4, skinLight);


    // Sunglasses

    pRect(s, 25, 19, 12, 6, glasses);
    pRect(s, 39, 19, 12, 6, glasses);
    pRect(s, 36, 20, 4, 2, glasses);

    pRect(
        s,
        28,
        20,
        6,
        2,
        glassHighlight
    );

    pRect(
        s,
        42,
        20,
        6,
        2,
        glassHighlight
    );


    // Face

    pRect(s, 35, 24, 5, 6, skinShadow);
    pRect(s, 31, 30, 14, 3, skinLight);


    // Neck

    pRect(s, 32, 33, 12, 8, skinShadow);


    // Body

    pRect(s, 20, 38, 34, 38, outline);


    // Jacket

    pRect(s, 23, 39, 28, 35, jacket);
    pRect(s, 23, 40, 6, 32, jacketLight);
    pRect(s, 45, 40, 6, 32, jacketDark);

    pRect(s, 36, 40, 2, 32, "#30363b");


    // Collar

    pRect(s, 25, 38, 10, 6, jacketLight);
    pRect(s, 39, 38, 10, 6, jacketDark);


    // Shirt

    pRect(s, 32, 41, 11, 13, shirt);


    // Backpack straps

    pRect(s, 22, 39, 4, 28, backpack);
    pRect(s, 48, 39, 4, 28, backpack);


    // Shoulders

    pRect(s, 18, 42, 8, 15, outline);
    pRect(s, 47, 42, 9, 15, outline);

    pRect(s, 20, 43, 8, 13, jacket);
    pRect(s, 47, 43, 8, 13, jacketDark);


    // Left arm

    pRect(s, 16, 52, 10, 23, outline);
    pRect(s, 18, 53, 7, 20, jacketLight);

    pRect(s, 18, 69, 7, 7, glove);
    pRect(s, 19, 69, 5, 3, gloveLight);


    // Right arm

    pRect(s, 48, 50, 11, 23, outline);
    pRect(s, 49, 52, 8, 18, jacketDark);

    pRect(s, 51, 68, 7, 7, glove);
    pRect(s, 52, 68, 5, 3, gloveLight);


    // Waist

    pRect(s, 22, 72, 32, 7, outline);
    pRect(s, 24, 72, 28, 5, jacketDark);


    // Jeans

    pRect(s, 22, 77, 32, 22, outline);
    pRect(s, 24, 78, 13, 18, jeans);
    pRect(s, 39, 78, 13, 18, jeansDark);
    pRect(s, 25, 79, 7, 14, jeansLight);


    // Boots

    pRect(s, 23, 95, 14, 6, outline);
    pRect(s, 38, 95, 15, 6, outline);

    pRect(s, 25, 95, 11, 4, "#252321");
    pRect(s, 40, 95, 12, 4, "#252321");


    // Rifle

    pRect(s, 53, 57, 9, 5, rifleWood);
    pRect(s, 57, 52, 7, 18, rifle);
    pRect(s, 59, 44, 5, 18, rifleMetal);

    pRect(s, 61, 25, 4, 22, rifle);
    pRect(s, 62, 15, 2, 12, rifleMetal);

    pRect(s, 57, 64, 5, 10, rifle);
    pRect(s, 58, 41, 3, 4, rifleMetal);
    pRect(s, 54, 54, 2, 21, "#554840");


    // Left Rifle

    pRect(s, 10, 57, 9, 5, rifleWood);
    pRect(s, 6, 52, 7, 18, rifle);
    pRect(s, 5, 44, 5, 18, rifleMetal);

    pRect(s, 3, 25, 4, 22, rifle);
    pRect(s, 3, 15, 2, 12, rifleMetal);

    pRect(s, 6, 64, 5, 10, rifle);
    pRect(s, 9, 41, 3, 4, rifleMetal);
    pRect(s, 10, 54, 2, 21, "#554840");

    return sprite;

}


// ============================================================
// DEMOGORGON SPRITE
// ============================================================

function createDemogorgonSprite() {

    const width =
        60;

    const height =
        74;


    const sprite =
        document.createElement(
            "canvas"
        );


    sprite.width =
        width;

    sprite.height =
        height;


    const s =
        sprite.getContext(
            "2d"
        );


    s.imageSmoothingEnabled =
        false;


    const outline = "#080912";
    const deep = "#101426";
    const purple = "#3b3152";
    const violet = "#5a456b";
    const crimson = "#702832";
    const mouth = "#160913";
    const teeth = "#c3b79b";


    // Crown

    pRect(s, 25, 0, 10, 13, deep);
    pRect(s, 8, 10, 11, 10, deep);
    pRect(s, 41, 10, 11, 10, deep);

    pRect(s, 14, 3, 10, 9, purple);
    pRect(s, 36, 3, 10, 9, purple);


    // Head

    pRect(s, 12, 13, 36, 20, outline);

    pRect(s, 7, 16, 10, 13, violet);
    pRect(s, 43, 16, 10, 13, violet);

    pRect(s, 16, 14, 28, 16, purple);

    pRect(s, 19, 17, 22, 11, crimson);

    pRect(s, 17, 19, 26, 11, mouth);


    // Teeth

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        pRect(
            s,
            19 + i * 3,
            20,
            2,
            3,
            teeth
        );

    }


    // Neck

    pRect(s, 23, 29, 14, 9, deep);


    // Body

    pRect(s, 17, 34, 26, 25, outline);

    pRect(s, 20, 36, 20, 21, purple);

    pRect(s, 23, 38, 4, 17, deep);
    pRect(s, 32, 38, 4, 17, violet);


    // Arms

    pRect(s, 8, 36, 14, 7, violet);
    pRect(s, 38, 36, 14, 7, violet);


    // Claws

    pRect(s, 6, 40, 6, 3, outline);
    pRect(s, 48, 40, 6, 3, outline);


    // Legs

    pRect(s, 20, 55, 9, 15, deep);
    pRect(s, 31, 55, 9, 15, deep);


    // Feet

    pRect(s, 17, 68, 12, 4, outline);
    pRect(s, 31, 68, 12, 4, outline);


    return sprite;

}


const playerSprite =
    createPlayerSprite();

const demogorgonSprite =
    createDemogorgonSprite();


// ============================================================
// DRAW PLAYER
// ============================================================

function drawPlayer() {

    const scale = 1.85;


    const width =
        playerSprite.width *
        scale;

    const height =
        playerSprite.height *
        scale;


    const x =
        player.x +
        player.width / 2 -
        width / 2;


    const y =
        player.y +
        player.height -
        height;


    ctx.drawImage(
        playerSprite,
        Math.round(x),
        Math.round(y),
        Math.round(width),
        Math.round(height)
    );

}


// ============================================================
// DRAW ENEMIES
// ============================================================

function drawEnemies() {

    for (
        const enemy of enemies
    ) {

        const scale =
            enemy.width /
            demogorgonSprite.width;


        const width =
            demogorgonSprite.width *
            scale;

        const height =
            demogorgonSprite.height *
            scale;


        const bob =
            Math.sin(
                enemy.animation *
                0.007
            ) * 1.2;


        ctx.drawImage(
            demogorgonSprite,
            Math.round(
                enemy.x +
                enemy.width / 2 -
                width / 2
            ),
            Math.round(
                enemy.y +
                bob
            ),
            Math.round(width),
            Math.round(height)
        );

    }

}


// ============================================================
// PARTICLES
// ============================================================

function createHitParticles(
    x,
    y
) {

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        particles.push({

            x,
            y,

            vx:
                (
                    Math.random() -
                    0.5
                ) * 4.5,

            vy:
                (
                    Math.random() -
                    0.5
                ) * 4.5,

            life: 280

        });

    }

}


function createDamageParticles() {

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        particles.push({

            x:
                player.x +
                player.width / 2,

            y:
                player.y +
                player.height / 2,

            vx:
                (
                    Math.random() -
                    0.5
                ) * 3,

            vy:
                (
                    Math.random() -
                    0.5
                ) * 3,

            life: 240

        });

    }

}


function updateParticles(
    deltaTime
) {

    const multiplier =
        deltaTime /
        16.67;


    for (
        let i =
            particles.length - 1;

        i >= 0;

        i--
    ) {

        const p =
            particles[i];


        p.x +=
            p.vx *
            multiplier;

        p.y +=
            p.vy *
            multiplier;

        p.life -=
            deltaTime;


        if (
            p.life <= 0
        ) {

            particles.splice(
                i,
                1
            );

        }

    }

}


function drawParticles() {

    for (
        const p of particles
    ) {

        ctx.globalAlpha =
            Math.max(
                p.life / 280,
                0
            );


        pRect(
            ctx,
            p.x,
            p.y,
            2,
            2,
            "#8a4035"
        );

    }


    ctx.globalAlpha = 1;

}


// ============================================================
// DRAW BULLETS
// ============================================================

function drawBullets() {

    for (
        const bullet of bullets
    ) {

        pRect(
            ctx,
            bullet.x,
            bullet.y,
            4,
            10,
            "#ded0a0"
        );


        pRect(
            ctx,
            bullet.x,
            bullet.y + 10,
            4,
            5,
            "#746644"
        );

    }

}


// ============================================================
// MUZZLE FLASH
// ============================================================

function drawMuzzleFlash(
    deltaTime
) {

    if (
        muzzleFlashTime <= 0
    ) {

        return;

    }


    pRect(
        ctx,
        player.x +
        player.width *
        0.84,
        player.y - 5,
        5,
        11,
        "#d5ba72"
    );


    muzzleFlashTime -=
        deltaTime;

}


// ============================================================
// DARK OVERLAY
// ============================================================

function drawBackgroundOverlay() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );


    gradient.addColorStop(
        0,
        "rgba(0,0,0,0.02)"
    );


    gradient.addColorStop(
        0.70,
        "rgba(0,0,0,0.02)"
    );


    gradient.addColorStop(
        1,
        "rgba(0,0,0,0.22)"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


// ============================================================
// SHAKE
// ============================================================

function getShake() {

    if (
        shakeTime <= 0
    ) {

        return {
            x: 0,
            y: 0
        };

    }


    return {

        x:
            (
                Math.random() -
                0.5
            ) * 5,

        y:
            (
                Math.random() -
                0.5
            ) * 5

    };

}


// ============================================================
// HUD
// ============================================================

function updateHUD() {

    killsElement.textContent =
        String(kills)
            .padStart(
                3,
                "0"
            );


    timeElement.textContent =
        formatTime(
            survivalTime
        );


    hunterElement.textContent =
        hunterName;


    waveElement.textContent =
        String(wave)
            .padStart(
                2,
                "0"
            );


    let hearts = "";


    for (
        let i = 0;
        i < lives;
        i++
    ) {

        hearts +=
            i === 0
                ? "♥"
                : " ♥";

    }


    livesElement.textContent =
        hearts;

}


// ============================================================
// TIME
// ============================================================

function formatTime(
    seconds
) {

    const minutes =
        Math.floor(
            seconds / 60
        )
        .toString()
        .padStart(
            2,
            "0"
        );


    const secs =
        Math.floor(
            seconds % 60
        )
        .toString()
        .padStart(
            2,
            "0"
        );


    return (
        `${minutes}:${secs}`
    );

}


// ============================================================
// RENDER
// ============================================================

function renderFrame(
    deltaTime
) {

    const shake =
        getShake();


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.save();


    ctx.translate(
        shake.x,
        shake.y
    );


    drawBackgroundOverlay();

    drawEnemies();

    drawBullets();

    drawParticles();

    drawPlayer();

    drawMuzzleFlash(
        deltaTime
    );


    ctx.restore();

}


// ============================================================
// GAME LOOP
// ============================================================

function gameLoop(
    timestamp
) {

    if (
        !gameRunning
    ) {

        return;

    }


    let deltaTime =
        timestamp -
        lastTimestamp;


    if (
        !Number.isFinite(
            deltaTime
        ) ||
        deltaTime <= 0
    ) {

        deltaTime = 16.67;

    }


    deltaTime =
        Math.min(
            deltaTime,
            50
        );


    lastTimestamp =
        timestamp;


    updatePlayer();

    updateBullets(
        deltaTime
    );

    updateEnemies(
        deltaTime
    );

    checkBulletCollisions();

    updateParticles(
        deltaTime
    );

    updateTimer(
        deltaTime
    );

    updateHUD();

    renderFrame(
        deltaTime
    );


    if (
        shakeTime > 0
    ) {

        shakeTime -=
            deltaTime;

    }


    animationFrameId =
        requestAnimationFrame(
            gameLoop
        );

}


// ============================================================
// START GAME
// ============================================================

function startGame() {

    gameRunning = true;

    deathPending = false;

    kills = 0;

    lives = 3;

    survivalTime = 0;

    wave = 1;

    previousWave = 1;

    enemySpawnTimer = 0;

    damageCooldown = 0;

    shakeTime = 0;

    muzzleFlashTime = 0;


    bullets.length = 0;
    enemies.length = 0;
    particles.length = 0;


    resizeCanvas();


    player.x =
        canvas.width / 2 -
        player.width / 2;


    player.y =
        canvas.height - 180;


    arcadeSidebar.classList.remove(
        "hidden"
    );


    /*
        Gameplay video.
    */

    startGameVideo();


    /*
        Much more active opening.
    */

    spawnEnemy();
    spawnEnemy();
    spawnEnemy();
    spawnEnemy();


    /*
        Draw before animation starts.
    */

    renderFrame(
        16.67
    );


    updateHUD();


    /*
        Start audio after the
        PLAY gesture.
    */

    startMusic();


    startAutomaticFire();


    lastTimestamp =
        performance.now();


    if (
        animationFrameId !== null
    ) {

        cancelAnimationFrame(
            animationFrameId
        );

    }


    animationFrameId =
        requestAnimationFrame(
            gameLoop
        );

}


// ============================================================
// END GAME
// ============================================================

function endGame() {

    if (
        !gameRunning
    ) {

        return;

    }


    gameRunning = false;


    stopAutomaticFire();

    stopAllGunSounds();


    if (
        animationFrameId !== null
    ) {

        cancelAnimationFrame(
            animationFrameId
        );

        animationFrameId = null;

    }


    bullets.length = 0;
    enemies.length = 0;
    particles.length = 0;


    stopGameVideo();


    arcadeSidebar.classList.add(
        "hidden"
    );


    deathTitle.textContent =
        `${hunterName} DIED`;


    finalKills.textContent =
        kills;


    finalTime.textContent =
        formatTime(
            survivalTime
        );


    finalWave.textContent =
        String(wave)
            .padStart(
                2,
                "0"
            );

            submitHunterScore();

    gameOverScreen.classList.remove(
        "hidden"
    );


    fadeOutMusic();

}

// ============================================================
// SUBMIT HUNTER SCORE
// ============================================================

async function submitHunterScore() {

    try {

        const { error } =
            await supabaseClient
                .from("hunters")
                .insert({
                    hunter_name:
                        hunterName,

                    kills:
                        kills,

                    survival_time:
                        Number(
                            survivalTime.toFixed(2)
                        ),

                    wave:
                        wave
                });


        if (error) {

            console.error(
                "Leaderboard submission failed:",
                error
            );

        }

    }
    catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );

    }

}


// ============================================================
// LOAD TOP HUNTERS
// ============================================================

async function loadLeaderboard() {

    leaderboardStatus.textContent =
        "ACCESSING HUNTER RECORDS...";

    leaderboardRows.innerHTML = "";


    try {

        const { data, error } =
            await supabaseClient
                .from("hunters")
                .select(
                    "hunter_name,kills,survival_time,wave"
                )
                .order(
                    "kills",
                    {
                        ascending: false
                    }
                )
                .order(
                    "survival_time",
                    {
                        ascending: false
                    }
                );
        


        if (error) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            leaderboardStatus.textContent =
                "NO HUNTERS RECORDED YET.";

            return;

        }


        leaderboardStatus.textContent ="";


        data.forEach(
            (hunter, index) => {

                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "leaderboardRow";


                row.innerHTML = `

                    <span
                        class="leaderboardRank"
                    >
                        #${index + 1}
                    </span>

                    <span
                        class="leaderboardHunter"
                    >
                        ${escapeLeaderboardText(
                            hunter.hunter_name
                        )}
                    </span>

                    <span>
                        ${hunter.kills}
                    </span>

                    <span>
                        ${formatTime(
                            Math.floor(
                                hunter.survival_time
                            )
                        )}
                    </span>

                `;


                leaderboardRows.appendChild(
                    row
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Leaderboard loading failed:",
            error
        );


        leaderboardStatus.textContent =
            "LEADERBOARD OFFLINE";

    }

}


// ============================================================
// LEADERBOARD TEXT SAFETY
// ============================================================

function escapeLeaderboardText(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

// ============================================================
// MUSIC FADE
// ============================================================

function fadeOutMusic() {

    let volume =
        bgm.volume;


    const fade =
        setInterval(
            () => {

                volume -=
                    0.04;


                if (
                    volume <= 0
                ) {

                    clearInterval(
                        fade
                    );

                    stopMusic();

                    return;

                }


                bgm.volume =
                    volume;

            },
            70
        );

}


// ============================================================
// PREPARE GAME
// ============================================================

function prepareHunt() {

    const rawName =
        hunterNameInput.value
            .trim()
            .replace(
                /\s+/g,
                " "
            );


    if (
        rawName.length < 1
    ) {

        nameError.classList.add(
            "show"
        );

        hunterNameInput.focus();

        return;

    }


    nameError.classList.remove(
        "show"
    );


    hunterName =
        rawName
            .substring(
                0,
                16
            )
            .toUpperCase();


    hunterNameInput.value =
        hunterName;


    /*
        This is a real user gesture.
        Prepare all audio now.
    */

    unlockAudio();


    if (loginVideo) {

        loginVideo.pause();

        loginVideo.currentTime = 0;

        loginVideo.classList.add(
            "hidden"
        );

    }


    mainMenu.classList.add(
        "hidden"
    );


    readyScreen.classList.remove(
        "hidden"
    );


    readyName.textContent =
        hunterName;


    runCountdown();

}


// ============================================================
// COUNTDOWN
// ============================================================

function runCountdown() {

    if (
        readyTimer !== null
    ) {

        clearInterval(
            readyTimer
        );

        readyTimer = null;

    }


    // Completely remove previous gameplay
    gameRunning = false;

    clearGameState();

    stopGameVideo();


    let count = 3;

    readyText.textContent =
        "GET READY";


    countdown.textContent =
        "3";


    readyTimer =
        setInterval(
            () => {

                count--;


                if (
                    count > 0
                ) {

                    countdown.textContent =
                        String(count);

                }
                else {

                    clearInterval(
                        readyTimer
                    );

                    readyTimer = null;


                    countdown.textContent =
                        "GO";


                    setTimeout(
                        () => {

                            readyScreen.classList.add(
                                "hidden"
                            );


                            startGame();

                        },
                        450
                    );

                }

            },
            700
        );

}

// ============================================================
// CLEAR GAME STATE / VISUALS
// ============================================================

function clearGameState() {

    // Stop automatic firing
    stopAutomaticFire();

    // Stop all gun sounds
    stopAllGunSounds();

    // Cancel animation frame
    if (
        animationFrameId !== null
    ) {

        cancelAnimationFrame(
            animationFrameId
        );

        animationFrameId = null;

    }

    // Clear all active objects
    bullets.length = 0;
    enemies.length = 0;
    particles.length = 0;

    // Reset timers
    enemySpawnTimer = 0;
    damageCooldown = 0;
    shakeTime = 0;
    muzzleFlashTime = 0;

    // Clear wave announcement
    if (
        waveAnnouncementTimer
    ) {

        clearTimeout(
            waveAnnouncementTimer
        );

        waveAnnouncementTimer = null;

    }

    if (
        waveAnnouncement
    ) {

        waveAnnouncement.classList.add(
            "hidden"
        );

        waveAnnouncement.classList.remove(
            "show"
        );

    }

    // Completely clear previous canvas image
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}

// ============================================================
// RESTART
// ============================================================

function restartGame() {

    // Make absolutely sure the previous game is stopped
    gameRunning = false;

    deathPending = false;

    clearGameState();

    stopGameVideo();

    stopMusic();


    // Hide game over
    gameOverScreen.classList.add(
        "hidden"
    );


    // Hide gameplay HUD
    arcadeSidebar.classList.add(
        "hidden"
    );


    // Show main menu
    mainMenu.classList.remove(
        "hidden"
    );


    // Reset login video
    if (loginVideo) {

        loginVideo.classList.remove(
            "hidden"
        );

        loginVideo.currentTime = 0;

        loginVideo.play().catch(
            () => {}
        );

    }


    // IMPORTANT:
    // Start with a fresh name
    hunterName = "";

    hunterNameInput.value = "";

    nameError.classList.remove(
        "show"
    );


    // Reset displayed ready name
    readyName.textContent =
        "HUNTER";


    // Reset countdown
    countdown.textContent =
        "3";


    hunterNameInput.focus();

}


// ============================================================
// BUTTONS
// ============================================================

document.getElementById(
    "startButton"
)
.addEventListener(
    "click",
    prepareHunt
);


document.getElementById(
    "restartButton"
)
.addEventListener(
    "click",
    restartGame
);

leaderboardButton.addEventListener(
    "click",
    () => {

        leaderboardScreen.classList.remove(
            "hidden"
        );

        loadLeaderboard();

    }
);


closeLeaderboard.addEventListener(
    "click",
    () => {

        leaderboardScreen.classList.add(
            "hidden"
        );

    }
);


// ============================================================
// ENTER
// ============================================================

hunterNameInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            prepareHunt();

        }

    }
);


// ============================================================
// UPPERCASE NAME
// ============================================================

hunterNameInput.addEventListener(
    "input",
    () => {

        const cursor =
            hunterNameInput.selectionStart;


        hunterNameInput.value =
            hunterNameInput.value
                .toUpperCase();


        hunterNameInput.setSelectionRange(
            cursor,
            cursor
        );

    }
);



// ============================================================
// INITIALIZE
// ============================================================

resizeCanvas();

ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
);