let currentStage = 1;
let isAutoPlay = false;
let autoInterval;

const programs = [
    { name: 'DNBI', icon: '💼' },
    { name: 'TZM', icon: '📊' },
    { name: 'NPN', icon: '🔢' },
    { name: 'DPT', icon: '📋' }
];

const tools = [
    { name: 'Merlin', icon: '🔮' },
    { name: 'VaxWing', icon: '💉' },
    { name: 'Pshigur', icon: '⚙️' },
    { name: 'EngrIT', icon: '🔧' },
    { name: 'DPT-Tables', icon: '📊' }
];

function createItemElement(item, type) {
    const div = document.createElement('div');
    div.className = `item ${type}`;
    div.innerHTML = `
        <div class="item-icon">${item.icon}</div>
        <div style="text-align: center; line-height: 1.2;">${item.name}</div>
    `;
    return div;
}

function renderStage(stage, animated = false) {
    const legacyContainer = document.getElementById('legacy-container');
    const modernContainer = document.getElementById('modern-container');
    
    if (animated && stage > 1) {
        // Handle migration animations
        if (stage === 2) {
            // Programs migrate from legacy to modern
            animateMigration('program', 'legacy', 'modern', () => {
                renderStageContent(stage, legacyContainer, modernContainer);
            });
        } else if (stage === 3) {
            // Tools migrate from legacy to modern
            animateMigration('tool', 'legacy', 'modern', () => {
                renderStageContent(stage, legacyContainer, modernContainer);
            });
        }
    } else if (animated && stage === 1) {
        // Going back - animate everything back to legacy
        animateBackToLegacy(() => {
            renderStageContent(stage, legacyContainer, modernContainer);
        });
    } else {
        renderStageContent(stage, legacyContainer, modernContainer);
    }

    updateStageIndicator(stage);
    updateControls();
}

function animateMigration(itemType, fromSide, toSide, callback) {
    const itemsToMigrate = document.querySelectorAll(`.item.${itemType}`);
    let migratedCount = 0;
    
    itemsToMigrate.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add(`migrating-to-${toSide.toLowerCase()}`);
            
            // Remove the item after animation completes
            setTimeout(() => {
                item.remove();
                migratedCount++;
                
                // When all items are migrated, render the new stage
                if (migratedCount === itemsToMigrate.length) {
                    callback();
                }
            }, 2000);
        }, index * 200);
    });
}

function animateBackToLegacy(callback) {
    const allModernItems = document.querySelectorAll('#modern-container .item');
    let migratedCount = 0;
    
    if (allModernItems.length === 0) {
        callback();
        return;
    }
    
    allModernItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('migrating-to-legacy');
            
            setTimeout(() => {
                item.remove();
                migratedCount++;
                
                if (migratedCount === allModernItems.length) {
                    callback();
                }
            }, 2000);
        }, index * 150);
    });
}

function renderStageContent(stage, legacyContainer, modernContainer) {
    // Clear containers
    legacyContainer.innerHTML = '';
    modernContainer.innerHTML = '';

    switch(stage) {
        case 1:
            // All items in legacy
            programs.forEach((program, index) => {
                const element = createItemElement(program, 'program');
                legacyContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), index * 200);
            });
            tools.forEach((tool, index) => {
                const element = createItemElement(tool, 'tool');
                legacyContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), (programs.length + index) * 200);
            });
            modernContainer.innerHTML = '<div class="empty-state">ממתין להעברה...</div>';
            break;

        case 2:
            // Programs in modern, tools in legacy
            tools.forEach((tool, index) => {
                const element = createItemElement(tool, 'tool');
                legacyContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), index * 150);
            });
            programs.forEach((program, index) => {
                const element = createItemElement(program, 'program');
                modernContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), index * 150);
            });
            break;

        case 3:
            // All items in modern
            legacyContainer.innerHTML = '<div class="empty-state">ההעברה הושלמה!</div>';
            programs.forEach((program, index) => {
                const element = createItemElement(program, 'program');
                modernContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), index * 150);
            });
            tools.forEach((tool, index) => {
                const element = createItemElement(tool, 'tool');
                modernContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), (programs.length + index) * 150);
            });
            break;
    }
}

function updateStageIndicator(stage) {
    const dots = document.querySelectorAll('.dot');
    const stageLabel = document.querySelector('.stage-label');
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === stage);
    });

    const stageLabels = [
        'שלב 1: מצב התחלתי - כל המערכות במורשת',
        'שלב 2: תוכנות הועברו - אפליקציות עברו למודרנית',
        'שלב 3: העברה מושלמת - כל המערכות מודרניות'
    ];
    
    stageLabel.textContent = stageLabels[stage - 1];
}

function updateControls() {
    document.getElementById('prev-btn').disabled = currentStage === 1;
    document.getElementById('next-btn').disabled = currentStage === 3;
}

function nextStage() {
    if (currentStage < 3) {
        currentStage++;
        renderStage(currentStage, true);
    }
}

function previousStage() {
    if (currentStage > 1) {
        currentStage--;
        renderStage(currentStage, true);
    }
}

function toggleAuto() {
    const autoBtn = document.getElementById('auto-btn');
    
    if (isAutoPlay) {
        clearInterval(autoInterval);
        isAutoPlay = false;
        autoBtn.innerHTML = '▶️ הפעלה אוטומטית';
    } else {
        isAutoPlay = true;
        autoBtn.innerHTML = '⏸️ השהה';
        autoInterval = setInterval(() => {
            if (currentStage < 3) {
                nextStage();
            } else {
                currentStage = 1;
                renderStage(currentStage, true);
            }
        }, 5000); // Increased to 5 seconds to allow time for animations
    }
}

// Initialize with auto-play
renderStage(1);

// Start auto-play after initial load
setTimeout(() => {
    toggleAuto();
}, 2000);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === ' ') {
        nextStage();
    } else if (e.key === 'ArrowRight') {
        previousStage();
    }
}); 