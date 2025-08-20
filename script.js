let currentStage = 1;
let isAutoPlay = true;
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

const modernTools = [
    { name: 'Merlin 2.0', icon: '🌟' },
    { name: 'VaxWing Pro', icon: '🚀' },
    { name: 'Pshigur Cloud', icon: '☁️' },
    { name: 'EngrIT Studio', icon: '⚡' },
    { name: 'DPT Analytics', icon: '📈' }
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

function createContainerElement(title) {
    const div = document.createElement('div');
    div.className = 'vm-container';
    div.innerHTML = `
        <div class="container-title">${title}</div>
        <div class="container-content"></div>
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
        } else if (stage === 4) {
            // Tools migrate to VM container
            animateMigration('tool', 'modern', 'vm', () => {
                renderStageContent(stage, legacyContainer, modernContainer);
            });
        } else if (stage === 5) {
            // Tools transform to modern tools
            animateToolsTransformation(() => {
                renderStageContent(stage, legacyContainer, modernContainer);
            });
        }
    } else if (animated && stage < 4) {
        // Going back - animate everything back appropriately
        if (stage === 1) {
            animateBackToLegacy(() => {
                renderStageContent(stage, legacyContainer, modernContainer);
            });
        } else if (stage === 2) {
            animateToolsBackToLegacy(() => {
                renderStageContent(stage, legacyContainer, modernContainer);
            });
        } else if (stage === 3) {
            animateToolsToModern(() => {
                renderStageContent(stage, legacyContainer, modernContainer);
            });
        } else if (stage === 4) {
            animateToolsBackToModern(() => {
                renderStageContent(stage, legacyContainer, modernContainer);
            });
        }
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
            }, 1200);
        }, index * 100);
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
            }, 1200);
        }, index * 80);
    });
}

function animateToolsBackToLegacy(callback) {
    const modernTools = document.querySelectorAll('#modern-container .item.tool');
    let migratedCount = 0;
    
    if (modernTools.length === 0) {
        callback();
        return;
    }
    
    modernTools.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('migrating-to-legacy');
            
            setTimeout(() => {
                item.remove();
                migratedCount++;
                
                if (migratedCount === modernTools.length) {
                    callback();
                }
            }, 1200);
        }, index * 80);
    });
}

function animateToolsToModern(callback) {
    const legacyTools = document.querySelectorAll('#legacy-container .item.tool');
    let migratedCount = 0;
    
    if (legacyTools.length === 0) {
        callback();
        return;
    }
    
    legacyTools.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('migrating-to-modern');
            
            setTimeout(() => {
                item.remove();
                migratedCount++;
                
                if (migratedCount === legacyTools.length) {
                    callback();
                }
            }, 1200);
        }, index * 80);
    });
}

function animateToolsBackToModern(callback) {
    const vmTools = document.querySelectorAll('#modern-container .vm-container .item.tool');
    let migratedCount = 0;
    
    if (vmTools.length === 0) {
        callback();
        return;
    }
    
    vmTools.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('migrating-to-modern');
            
            setTimeout(() => {
                item.remove();
                migratedCount++;
                
                if (migratedCount === vmTools.length) {
                    callback();
                }
            }, 1200);
        }, index * 80);
    });
}

function animateToolsTransformation(callback) {
    const vmTools = document.querySelectorAll('#modern-container .vm-container .item.tool');
    let transformedCount = 0;
    
    if (vmTools.length === 0) {
        callback();
        return;
    }
    
    vmTools.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('transforming');
            
            setTimeout(() => {
                item.remove();
                transformedCount++;
                
                if (transformedCount === vmTools.length) {
                    callback();
                }
            }, 1500);
        }, index * 100);
    });
}

function renderStageContent(stage, legacyContainer, modernContainer) {
    // Clear containers
    legacyContainer.innerHTML = '';
    modernContainer.innerHTML = '';
    
    // Update container classes
    modernContainer.parentElement.classList.remove('stage-4', 'stage-5');
    if (stage === 4) {
        modernContainer.parentElement.classList.add('stage-4');
    } else if (stage === 5) {
        modernContainer.parentElement.classList.add('stage-5');
    }

    switch(stage) {
        case 1:
            // All items in legacy
            programs.forEach((program, index) => {
                const element = createItemElement(program, 'program');
                legacyContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), index * 100);
            });
            tools.forEach((tool, index) => {
                const element = createItemElement(tool, 'tool');
                legacyContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), (programs.length + index) * 100);
            });
            modernContainer.innerHTML = '<div class="empty-state">ממתין להעברה...</div>';
            break;

        case 2:
            // Programs in modern, tools in legacy
            tools.forEach((tool, index) => {
                const element = createItemElement(tool, 'tool');
                legacyContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), index * 80);
            });
            programs.forEach((program, index) => {
                const element = createItemElement(program, 'program');
                modernContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), index * 80);
            });
            break;

        case 3:
            // All items in modern
            legacyContainer.innerHTML = '<div class="empty-state">ההעברה הושלמה!</div>';
            programs.forEach((program, index) => {
                const element = createItemElement(program, 'program');
                modernContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), index * 80);
            });
            tools.forEach((tool, index) => {
                const element = createItemElement(tool, 'tool');
                modernContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), (programs.length + index) * 80);
            });
            break;

        case 4:
            // Programs in modern, tools in VM container
            legacyContainer.innerHTML = '<div class="empty-state">ההעברה הושלמה!</div>';
            
            // Create VM container that takes full width at the top
            const vmContainer = createContainerElement('Container');
            vmContainer.style.width = '100%';
            vmContainer.style.marginBottom = '20px';
            modernContainer.appendChild(vmContainer);
            
            // Add tools to VM container in a full row
            const containerContent = vmContainer.querySelector('.container-content');
            containerContent.style.display = 'flex';
            containerContent.style.flexDirection = 'row';
            containerContent.style.justifyContent = 'space-around';
            containerContent.style.alignItems = 'center';
            containerContent.style.gap = '15px';
            containerContent.style.flexWrap = 'wrap';
            containerContent.style.minHeight = 'auto';
            
            // Debug: log the computed styles
            console.log('Container content display:', getComputedStyle(containerContent).display);
            console.log('Container content flexDirection:', getComputedStyle(containerContent).flexDirection);
            tools.forEach((tool, index) => {
                const element = createItemElement(tool, 'tool');
                // Force horizontal layout for tools in stage 4
                element.style.flexShrink = '0';
                element.style.margin = '0 5px';
                containerContent.appendChild(element);
                setTimeout(() => element.classList.add('visible'), index * 80);
            });
            
            // Add programs at the bottom of the modern container
            const programsContainer = document.createElement('div');
            programsContainer.className = 'items-container';
            programsContainer.style.marginTop = '20px';
            modernContainer.appendChild(programsContainer);
            
            programs.forEach((program, index) => {
                const element = createItemElement(program, 'program');
                programsContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), (tools.length + index) * 80);
            });
            break;

        case 5:
            // All programs migrated, tools rebuilt with modern tech stack
            legacyContainer.innerHTML = '<div class="empty-state">המעבר הושלם! 🎉</div>';
            
            // Create modern tools container that takes full width at the top
            const modernToolsContainer = createContainerElement('🛠️ כלים מודרניים חדשים');
            modernToolsContainer.className = 'vm-container modern-tools-container';
            modernToolsContainer.style.width = '100%';
            modernToolsContainer.style.marginBottom = '20px';
            modernContainer.appendChild(modernToolsContainer);
            
            // Add modern tools to container in a full row (like stage 4)
            const modernToolsContent = modernToolsContainer.querySelector('.container-content');
            modernToolsContent.style.display = 'flex';
            modernToolsContent.style.flexDirection = 'row';
            modernToolsContent.style.justifyContent = 'space-around';
            modernToolsContent.style.alignItems = 'center';
            modernToolsContent.style.gap = '15px';
            modernToolsContent.style.flexWrap = 'wrap';
            modernToolsContent.style.minHeight = 'auto';
            
            modernTools.forEach((tool, index) => {
                const element = createItemElement(tool, 'modern-tool');
                // Force horizontal layout for modern tools in stage 5
                element.style.flexShrink = '0';
                element.style.margin = '0 5px';
                modernToolsContent.appendChild(element);
                setTimeout(() => element.classList.add('visible'), index * 80);
            });
            
            // Add programs at the bottom of the modern container
            const finalProgramsContainer = document.createElement('div');
            finalProgramsContainer.className = 'items-container';
            finalProgramsContainer.style.marginTop = '20px';
            modernContainer.appendChild(finalProgramsContainer);
            
            programs.forEach((program, index) => {
                const element = createItemElement(program, 'program');
                finalProgramsContainer.appendChild(element);
                setTimeout(() => element.classList.add('visible'), (modernTools.length + index) * 80);
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
        'שלב 3: העברה מושלמת - כל המערכות מודרניות',
        'שלב 4: מיכל וירטואלי - כלים פועלים במיכל',
        'שלב 5: כלים מודרניים - נבנו מחדש עם טכנולוגיות חדשות'
    ];
    
    stageLabel.textContent = stageLabels[stage - 1];
}

function updateControls() {
    document.getElementById('prev-btn').disabled = currentStage === 1;
    document.getElementById('next-btn').disabled = currentStage === 5;
}

function nextStage() {
    if (currentStage < 5) {
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
            if (currentStage < 5) {
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