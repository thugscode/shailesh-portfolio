// Blockchain Network Visualization
class BlockchainNetwork {
    constructor() {
        this.canvas = document.getElementById('blockchainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.cryptoSymbols = ['₿', '⧫', '∑', '⚡', '∞', '◈', '⬢', '⬡'];
        this.hashPatterns = [];
        
        this.resizeCanvas();
        this.initNodes();
        this.initCryptoSymbols();
        this.initBlockchain();
        this.initBinaryRain();
        this.initEncryptionAnimation();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initNodes() {
        const numNodes = Math.floor(window.innerWidth / 100);
        this.nodes = [];

        for (let i = 0; i < numNodes; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                connections: [],
                hash: this.generateHash(),
                pulseRadius: 0,
                pulseOpacity: 1
            });
        }

        // Create connections
        this.nodes.forEach((node, i) => {
            const numConnections = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numConnections; j++) {
                const target = this.nodes[(i + j + 1) % this.nodes.length];
                node.connections.push(target);
            }
        });
    }

    generateHash() {
        const chars = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < 8; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }

    initCryptoSymbols() {
        const container = document.querySelector('.crypto-symbols');
        setInterval(() => {
            const symbol = document.createElement('div');
            symbol.className = 'crypto-symbol';
            symbol.style.left = `${Math.random() * 100}%`;
            symbol.textContent = this.cryptoSymbols[Math.floor(Math.random() * this.cryptoSymbols.length)];
            container.appendChild(symbol);

            setTimeout(() => {
                container.removeChild(symbol);
            }, 10000);
        }, 1000);
    }

    initBlockchain() {
        const container = document.querySelector('.block-container');
        for (let i = 0; i < 10; i++) {
            const block = document.createElement('div');
            block.className = 'block';
            container.appendChild(block);
        }

        // Initialize hash animation
        this.updateHashAnimation();
        setInterval(() => this.updateHashAnimation(), 3000);
    }

    updateHashAnimation() {
        const hashElement = document.querySelector('.hash-animation');
        const newHash = this.generateHash();
        hashElement.textContent = `Mining block... ${newHash}`;
        
        gsap.from(hashElement, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        });
    }

    initBinaryRain() {
        const container = document.querySelector('.binary-rain');
        const createBinary = () => {
            const binary = document.createElement('div');
            binary.className = 'binary';
            binary.style.left = `${Math.random() * 100}%`;
            binary.style.animationDuration = `${Math.random() * 3 + 2}s`;
            binary.textContent = Math.random() > 0.5 ? '1' : '0';
            container.appendChild(binary);

            setTimeout(() => {
                container.removeChild(binary);
            }, 5000);
        };

        // Create initial binary elements
        for (let i = 0; i < 50; i++) {
            setTimeout(createBinary, Math.random() * 2000);
        }

        // Continue creating binary elements
        setInterval(createBinary, 200);
    }

    initEncryptionAnimation() {
        const plaintext = document.querySelector('.plaintext');
        const keyStream = document.querySelector('.key-stream');
        const ciphertext = document.querySelector('.ciphertext');

        const updateEncryption = () => {
            // Generate random plaintext
            const text = this.generateRandomText(8);
            plaintext.textContent = text;

            // Generate random key
            const key = this.generateRandomText(8);
            keyStream.textContent = key;

            // Simulate encryption (XOR operation)
            const encrypted = this.xorStrings(text, key);
            ciphertext.textContent = encrypted;
        };

        updateEncryption();
        setInterval(updateEncryption, 3000);
    }

    generateRandomText(length) {
        const chars = '0123456789ABCDEF';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    xorStrings(str1, str2) {
        let result = '';
        for (let i = 0; i < str1.length; i++) {
            const xor = parseInt(str1[i], 16) ^ parseInt(str2[i], 16);
            result += xor.toString(16).toUpperCase();
        }
        return result;
    }

    handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        this.nodes.forEach(node => {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
                node.pulseRadius = 20;
                node.pulseOpacity = 1;
                
                // Create a ripple effect
                const ripple = {
                    x: node.x,
                    y: node.y,
                    radius: 0,
                    opacity: 1
                };
                
                gsap.to(ripple, {
                    radius: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                    onUpdate: () => {
                        this.drawRipple(ripple);
                    }
                });
            }
        });
    }

    drawRipple(ripple) {
        this.ctx.beginPath();
        this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(0, 255, 136, ${ripple.opacity})`;
        this.ctx.stroke();
    }

    drawNode(node) {
        // Draw connections
        node.connections.forEach(target => {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y);
            this.ctx.lineTo(target.x, target.y);
            this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
            this.ctx.stroke();
        });

        // Draw node
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        this.ctx.fillStyle = '#00ff88';
        this.ctx.fill();

        // Draw pulse effect
        if (node.pulseRadius > 0) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(0, 255, 136, ${node.pulseOpacity})`;
            this.ctx.stroke();

            node.pulseRadius += 1;
            node.pulseOpacity -= 0.02;

            if (node.pulseOpacity <= 0) {
                node.pulseRadius = 0;
                node.pulseOpacity = 1;
            }
        }

        // Draw hash
        this.ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
        this.ctx.font = '10px monospace';
        this.ctx.fillText(node.hash, node.x + 10, node.y + 10);

        // Add cryptographic visual elements
        this.drawCryptoSymbols(node);
    }

    drawCryptoSymbols(node) {
        const symbols = ['⚿', '⚷', '⚶', '⚸'];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        
        if (Math.random() < 0.01) { // Occasionally show crypto symbols
            this.ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
            this.ctx.font = '16px monospace';
            this.ctx.fillText(symbol, node.x - 8, node.y - 8);
            
            // Add a glow effect
            this.ctx.shadowColor = 'rgba(0, 255, 136, 0.5)';
            this.ctx.shadowBlur = 10;
            this.ctx.fillText(symbol, node.x - 8, node.y - 8);
            this.ctx.shadowBlur = 0;
        }
    }

    updateNode(node) {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Create a gradient background effect
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.05)');
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw nodes
        this.nodes.forEach(node => {
            this.updateNode(node);
            this.drawNode(node);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the blockchain network when the page loads
window.addEventListener('load', () => {
    new BlockchainNetwork();
}); 