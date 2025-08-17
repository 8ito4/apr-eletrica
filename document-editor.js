document.addEventListener('DOMContentLoaded', function() {
    // Initialize document editing features with event listeners
    document.querySelector('#add-row-btn').addEventListener('click', addNewItem);
    document.querySelector('#add-table-btn').addEventListener('click', addNewTable);
    document.querySelector('#aplicar-btn').addEventListener('click', applyChange);
    document.querySelector('#desfazer-btn').addEventListener('click', undoLastAction);
    document.querySelector('#limpar-btn').addEventListener('click', clearFields);
    
    // Initialize color buttons
    document.querySelectorAll('.color-btn').forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            changeCellColor(this, color);
        });
    });
    
    let actionHistory = [];

    function undoLastAction() {
        if (actionHistory.length === 0) {
            alert('Não há ações para desfazer.');
            return;
        }

        const lastAction = actionHistory.pop();

        switch (lastAction.type) {
            case 'addRow':
                const table = document.getElementById(lastAction.tableId);
                if (table) {
                    table.deleteRow(lastAction.rowIndex);
                }
                break;
            case 'addTable':
                const tableToRemove = document.getElementById(lastAction.tableId);
                if (tableToRemove) {
                    tableToRemove.parentNode.removeChild(tableToRemove);
                }
                break;
            case 'editCell':
                const tableToEdit = document.getElementById(lastAction.tableId);
                if (tableToEdit) {
                    const cell = tableToEdit.rows[lastAction.rowIndex].cells[lastAction.cellIndex];
                    if (cell) {
                        cell.innerHTML = lastAction.previousValue;
                    }
                }
                break;
            case 'changeColor':
                const tableToColor = document.getElementById(lastAction.tableId);
                if (tableToColor) {
                    const rowToColor = tableToColor.rows[lastAction.lineNum];
                    if (rowToColor) {
                        rowToColor.cells[lastAction.cellIndex].style.backgroundColor = lastAction.previousValue;
                    }
                }
                break;
            default:
                alert('Ação desconhecida.');
        }
    }

    // The following function is defined in the global scope (window)
    window.handleCheckbox = function(checkbox, id) {
        const checkboxId = checkbox.id;
        const otherCheckboxId = checkboxId.includes('se-aplica') 
            ? checkboxId.replace('se-aplica', 'nao-se-aplica') 
            : checkboxId.replace('nao-se-aplica', 'se-aplica');
        
        document.getElementById(otherCheckboxId).checked = false;
        
        // Color the title cell based on selection
        const table = document.getElementById(`epi-table-${id}`);
        if (table) {
            const headerRow = table.querySelector('.first-row');
            if (headerRow) {
                const titleCell = headerRow.querySelector('.table-title');
                if (titleCell) {
                    if (checkboxId.includes('se-aplica') && checkbox.checked) {
                        titleCell.style.backgroundColor = '#d4edda'; // verde claro
                    } else if (checkboxId.includes('nao-se-aplica') && checkbox.checked) {
                        titleCell.style.backgroundColor = '#f8d7da'; // vermelho claro
                    } else {
                        titleCell.style.backgroundColor = ''; // voltar ao padrão
                    }
                }
            }
        }
    };

    function changeCellColor(button, color) {
        const tableNum = document.querySelector('#table-step').value.trim();
        const lineNum = document.querySelector('#table-line').value.trim();
        
        if (!tableNum || !lineNum) {
            alert('Por favor, informe o número da tabela e da linha.');
            return;
        }
        
        const table = document.getElementById(`epi-table-${tableNum}`);
        if (!table) {
            alert('Tabela não encontrada');
            return;
        }

        const row = table.rows[lineNum];
        if (!row) {
            alert('Linha não encontrada');
            return;
        }

        // Store the current state for undo feature
        actionHistory.push({
            type: 'changeColor',
            tableId: `epi-table-${tableNum}`,
            lineNum,
            cellIndex: 3, // Quarta coluna (índice 3)
            previousValue: row.cells[3].style.backgroundColor
        });

        // Apply the color to the cell
        row.cells[3].style.backgroundColor = color;
    }

    function addNewItem() {
        const tableNum = document.querySelector('#add-row-input').value.trim();
        
        if (!tableNum) {
            alert('Por favor, digite o número da tabela');
            return;
        }
        
        const table = document.getElementById(`epi-table-${tableNum}`);
        if (!table) {
            alert('Tabela não encontrada');
            return;
        }

        const newRow = table.insertRow(table.rows.length - 1);
        newRow.innerHTML = `
            <td colspan="2" contenteditable="true" class="editable-cell">-</td>
            <td contenteditable="true" class="editable-cell">-</td>
            <td contenteditable="true" class="editable-cell">-</td>
            <td contenteditable="true" class="editable-cell">-</td>
            <td colspan="2" class="merged editable-cell" contenteditable="true">-</td>
        `;

        actionHistory.push({
            type: 'addRow',
            tableId: `epi-table-${tableNum}`,
            rowIndex: newRow.rowIndex
        });
        
        // Visual feedback
        const btn = document.querySelector('#add-row-btn');
        const originalText = btn.textContent;
        btn.textContent = "Adicionado!";
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1000);
    }

    function addNewTable() {
        const allTables = document.querySelectorAll('[id^="epi-table-"]');
        let maxId = 0;
        allTables.forEach(table => {
            const idMatch = table.id.match(/epi-table-(\d+)/);
            if (idMatch && parseInt(idMatch[1]) > maxId) {
                maxId = parseInt(idMatch[1]);
            }
        });
        
        const newTableId = maxId + 1;
        
        // Create new table container
        const container = document.createElement('div');
        container.className = 'risk-table-container';
        
        // Create the new table HTML
        container.innerHTML = `
            <table class="flex-table" id="epi-table-${newTableId}">
                <tr class="first-row">
                    <td colspan="5" class="merged table-title" id="table-title-${newTableId}">Etapa ${newTableId}</td>
                    <td colspan="2">
                        <div class="checkbox-container">
                            <input type="checkbox" id="se-aplica-${newTableId}" onclick="handleCheckbox(this, '${newTableId}')">
                            <label for="se-aplica-${newTableId}">Se aplica</label>
                            <input type="checkbox" id="nao-se-aplica-${newTableId}" onclick="handleCheckbox(this, '${newTableId}')">
                            <label for="nao-se-aplica-${newTableId}">Não se aplica</label>
                        </div>
                    </td>
                </tr>
                <tr class="second-row">
                    <td colspan="2" class="merged">Risco</td>
                    <td>P</td>
                    <td>S</td>
                    <td>R</td>
                    <td colspan="2" class="merged">Medidas preventivas</td>
                </tr>
                <tr>
                    <td colspan="2" contenteditable="true" class="editable-cell">-</td>
                    <td contenteditable="true" class="editable-cell">-</td>
                    <td contenteditable="true" class="editable-cell">-</td>
                    <td contenteditable="true" class="editable-cell">-</td>
                    <td colspan="2" class="merged editable-cell" contenteditable="true">-</td>
                </tr>
                <tr id="epi-recomendado-${newTableId}">
                    <td colspan="7" class="merged editable-cell" contenteditable="true">EPI recomendado:</td>
                </tr>
            </table>
        `;
        
        // Insert the new table after the last table
        const lastTable = document.getElementById(`epi-table-${maxId}`);
        if (lastTable) {
            const lastTableContainer = lastTable.closest('.risk-table-container');
            if (lastTableContainer) {
                lastTableContainer.after(container);
            } else {
                lastTable.after(container);
            }
        }

        actionHistory.push({
            type: 'addTable',
            tableId: `epi-table-${newTableId}`
        });
        
        // Visual feedback
        const btn = document.querySelector('#add-table-btn');
        const originalText = btn.textContent;
        btn.textContent = "Adicionado!";
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1000);
    }

    function applyChange() {
        const tableNum = document.querySelector('#table-step').value.trim();
        const lineNum = document.querySelector('#table-line').value.trim();
        
        if (!tableNum) {
            alert('Por favor, informe o número da tabela.');
            return;
        }
        
        const table = document.getElementById(`epi-table-${tableNum}`);
        if (!table) {
            alert('Tabela não encontrada');
            return;
        }

        const stepDescription = document.querySelector('#step-description').value.trim();
        const risk = document.querySelector('#risk').value.trim();
        const probability = document.querySelector('#probability').value.trim();
        const severity = document.querySelector('#severity').value.trim();
        const riskGrade = document.querySelector('#risk-grade').value.trim();
        const preventiveMeasures = document.querySelector('#preventive-measures').value.trim();
        const epiDescription = document.querySelector('#epi-description').value.trim();

        // Update step description (table title)
        if (stepDescription) {
            const titleCell = table.querySelector('.table-title');
            if (titleCell) {
                actionHistory.push({
                    type: 'editCell',
                    tableId: `epi-table-${tableNum}`,
                    rowIndex: 0,
                    cellIndex: 0,
                    previousValue: titleCell.innerHTML
                });
                titleCell.innerHTML = stepDescription;
            }
        }

        // Update EPI description
        if (epiDescription) {
            const epiCell = table.querySelector(`#epi-recomendado-${tableNum}`);
            if (epiCell) {
                actionHistory.push({
                    type: 'editCell',
                    tableId: `epi-table-${tableNum}`,
                    rowIndex: table.rows.length - 1,
                    cellIndex: 0,
                    previousValue: epiCell.innerHTML
                });
                epiCell.innerHTML = `<td colspan="7" class="merged editable-cell" contenteditable="true">${epiDescription}</td>`;
            }
        }

        // Update risk row
        if (lineNum && parseInt(lineNum) > 1 && parseInt(lineNum) < table.rows.length - 1) {
            const row = table.rows[parseInt(lineNum)];
            if (row) {
                if (risk) {
                    actionHistory.push({
                        type: 'editCell',
                        tableId: `epi-table-${tableNum}`,
                        rowIndex: parseInt(lineNum),
                        cellIndex: 0,
                        previousValue: row.cells[0].innerHTML
                    });
                    row.cells[0].innerHTML = risk;
                }
                if (probability) {
                    actionHistory.push({
                        type: 'editCell',
                        tableId: `epi-table-${tableNum}`,
                        rowIndex: parseInt(lineNum),
                        cellIndex: 2,
                        previousValue: row.cells[2].innerHTML
                    });
                    row.cells[2].innerHTML = probability;
                }
                if (severity) {
                    actionHistory.push({
                        type: 'editCell',
                        tableId: `epi-table-${tableNum}`,
                        rowIndex: parseInt(lineNum),
                        cellIndex: 3,
                        previousValue: row.cells[3].innerHTML
                    });
                    row.cells[3].innerHTML = severity;
                }
                if (riskGrade) {
                    actionHistory.push({
                        type: 'editCell',
                        tableId: `epi-table-${tableNum}`,
                        rowIndex: parseInt(lineNum),
                        cellIndex: 4,
                        previousValue: row.cells[4].innerHTML
                    });
                    row.cells[4].innerHTML = riskGrade;
                }
                if (preventiveMeasures) {
                    actionHistory.push({
                        type: 'editCell',
                        tableId: `epi-table-${tableNum}`,
                        rowIndex: parseInt(lineNum),
                        cellIndex: 5,
                        previousValue: row.cells[5].innerHTML
                    });
                    row.cells[5].innerHTML = preventiveMeasures;
                }
            } else {
                alert('Linha não encontrada');
            }
        } else if (lineNum) {
            alert('Número de linha inválido');
        }
        
        // Visual feedback
        const btn = document.querySelector('#aplicar-btn');
        const originalText = btn.textContent;
        btn.textContent = "Aplicado!";
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1000);
    }

    function clearFields() {
        document.querySelector('#table-step').value = '';
        document.querySelector('#table-line').value = '';
        document.querySelector('#step-description').value = '';
        document.querySelector('#risk').value = '';
        document.querySelector('#probability').value = '';
        document.querySelector('#severity').value = '';
        document.querySelector('#risk-grade').value = '';
        document.querySelector('#preventive-measures').value = '';
        document.querySelector('#epi-description').value = '';
        
        // Remove active class from color buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Visual feedback
        const btn = document.querySelector('#limpar-btn');
        const originalText = btn.textContent;
        btn.textContent = "Limpo!";
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1000);
    }
});