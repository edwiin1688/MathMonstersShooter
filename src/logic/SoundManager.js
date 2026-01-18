export const SoundManager = {
    ctx: null,
    muted: false, // Add muted flag

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    // New method to set muted state
    setMuted(val) {
        this.muted = val;
        if (this.ctx) {
            if (val) {
                this.ctx.suspend();
                if (this.bgmTimer) {
                    clearTimeout(this.bgmTimer);
                    this.bgmTimer = null;
                }
            } else {
                this.ctx.resume();
                if (this.isPlayingBGM && !this.bgmTimer) {
                    this.scheduleBGM();
                }
            }
        }
    },

    // New generic play method
    play(freq, type, duration) {
        if (this.muted) return; // Check muted flag
        this.init(); // Ensure context is initialized
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, t + duration); // Example ramp

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + duration);
    },

    shoot() {
        if (this.muted) return; // Check muted flag
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.2);
    },

    explosion() {
        if (this.muted) return; // Check muted flag
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(20, t + 0.3);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.3);
    },

    wrong() {
        if (this.muted) return; // Check muted flag
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.3);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.3);
    },

    // BGM System
    bgmTimer: null,
    isPlayingBGM: false,
    // Energetic Arpeggio (C Major -> F Major -> G Major -> C Major)
    bgmNotes: [
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63, // C
        349.23, 440.00, 523.25, 698.46, 523.25, 440.00, // F
        392.00, 493.88, 587.33, 783.99, 587.33, 493.88, // G
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63  // C
    ],
    bgmIndex: 0,

    playBGM() {
        if (this.isPlayingBGM) return;
        this.isPlayingBGM = true;
        this.bgmIndex = 0;
        this.scheduleBGM();
    },

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    },

    pauseBGM() {
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    },

    resumeBGM() {
        if (this.isPlayingBGM && !this.bgmTimer) {
            this.scheduleBGM();
        }
    },

    scheduleBGM() {
        if (!this.isPlayingBGM) return;

        if (!this.muted) {
            this.init();
            // Check state without forcing resume (which causes warnings if no gesture)
            if (this.ctx.state === 'running') {
                const freq = this.bgmNotes[this.bgmIndex % this.bgmNotes.length];
                this.playBGMNote(freq);
            }
        }

        this.bgmIndex++;
        // Fast interval for energetic feel (150ms)
        this.bgmTimer = setTimeout(() => this.scheduleBGM(), 150);
    },

    playBGMNote(freq) {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle'; // Triangle is energetic but not too harsh
        osc.frequency.setValueAtTime(freq, t);

        // Short, punchy envelope
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.02); // Fast attack
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15); // Fast decay

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.15);
    }
};
