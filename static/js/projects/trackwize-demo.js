(function () {
  'use strict';

  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function money(cents) {
    return 'RM ' + Math.abs(cents / 100).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function planMoney(cents) {
    return Math.abs(cents / 100).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function planRingMoney(cents) { return 'RM' + planMoney(cents); }
  function sum(entries, predicate) { return entries.reduce(function (total, entry) { return predicate(entry) ? total + entry.amountCents : total; }, 0); }
  function setText(root, selector, value) { var node = root.querySelector(selector); if (node) node.textContent = value; }
  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }

  function init() {
    var root = document.querySelector('[data-trackwize-demo]');
    if (!root) return;
    var now = new Date();
    var baseMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    var state = {
      entries: [], activePanel: 'home', filter: '', selectedBudget: 'savings', addType: 'expense', lastFocus: null, planTimer: null,
      planMonthOffset: 0, planAssets: [], planInvestments: [{ name: 'public bank', amountCents: 6000000 }],
      planSalaryCents: 500000, planSavingsCents: 0, planFixedCents: 0, planDailyLeftoverCents: 300000, planBillsCents: 101800, planRemainingCents: 396500
    };
    var sheet = root.querySelector('[data-tw-sheet]');
    var addForm = root.querySelector('[data-tw-add-form]');
    var status = root.querySelector('[data-tw-status]');

    function planDate() { return new Date(baseMonth.getFullYear(), baseMonth.getMonth() + state.planMonthOffset, 1); }
    function planMonthLabel() { var date = planDate(); return monthNames[date.getMonth()] + ' ' + date.getFullYear(); }
    function snapshot() {
      var income = sum(state.entries, function (entry) { return entry.kind === 'income'; });
      var savings = sum(state.entries, function (entry) { return entry.kind === 'savings'; });
      var fixed = sum(state.entries, function (entry) { return entry.category === 'fixed'; });
      var daily = sum(state.entries, function (entry) { return entry.category === 'daily'; });
      var utilities = sum(state.entries, function (entry) { return entry.kind === 'utility'; });
      return { income: income, savings: savings, fixed: fixed, daily: daily, utilities: utilities, expenses: fixed + daily + utilities, remaining: income - savings - fixed - daily - utilities, afterFixed: income - fixed - utilities, dailyToday: sum(state.entries, function (entry) { return entry.category === 'daily' && entry.date === 'Today'; }) };
    }

    function renderRows() {
      var list = root.querySelector('[data-tw-transaction-list]');
      var empty = root.querySelector('[data-tw-empty-state]');
      if (!list || !empty) return;
      clear(list);
      var query = state.filter.toLowerCase();
      var rows = state.entries.filter(function (entry) { return !query || entry.description.toLowerCase().indexOf(query) !== -1 || entry.category.toLowerCase().indexOf(query) !== -1; }).slice().reverse();
      rows.forEach(function (entry) {
        var row = document.createElement('div'); var copy = document.createElement('span'); var title = document.createElement('strong'); var meta = document.createElement('small'); var amount = document.createElement('b');
        row.className = 'tw-transaction-row ' + (entry.kind === 'income' ? 'is-income' : 'is-expense');
        title.textContent = entry.description; meta.textContent = entry.date + ' · ' + entry.category; amount.textContent = (entry.kind === 'income' ? '+ ' : '− ') + money(entry.amountCents);
        copy.appendChild(title); copy.appendChild(meta); row.appendChild(copy); row.appendChild(amount); list.appendChild(row);
      });
      empty.hidden = rows.length > 0;
    }

    function appendPlanRow(tbody, index, label, amount) {
      var row = document.createElement('tr');
      var number = document.createElement('td'); var name = document.createElement('td'); var value = document.createElement('td');
      number.textContent = String(index + 1); name.textContent = label; value.textContent = planMoney(amount);
      row.appendChild(number); row.appendChild(name); row.appendChild(value); tbody.appendChild(row);
    }
    function renderPlanTable(tableSelector, rows, totalSelector, emptyText) {
      var table = root.querySelector(tableSelector); if (!table) return;
      var tbody = table.querySelector('tbody'); clear(tbody);
      if (!rows.length) {
        var emptyRow = document.createElement('tr'); var emptyCell = document.createElement('td');
        emptyCell.colSpan = 3; emptyCell.textContent = emptyText; emptyRow.appendChild(emptyCell); tbody.appendChild(emptyRow);
      } else rows.forEach(function (row, index) { appendPlanRow(tbody, index, row.name, row.amountCents); });
      setText(root, totalSelector, planMoney(rows.reduce(function (total, row) { return total + row.amountCents; }, 0)));
    }
    function renderPlan() {
      var salary = state.planSalaryCents + sum(state.entries, function (entry) { return entry.kind === 'income'; });
      var savings = state.planSavingsCents + sum(state.entries, function (entry) { return entry.kind === 'savings'; });
      var fixed = state.planFixedCents + sum(state.entries, function (entry) { return entry.category === 'fixed'; });
      var bills = state.planBillsCents + sum(state.entries, function (entry) { return entry.kind === 'utility'; });
      var investmentsTotal = state.planInvestments.reduce(function (total, row) { return total + row.amountCents; }, 0);
      var assetsTotal = state.planAssets.reduce(function (total, row) { return total + row.amountCents; }, 0);
      var leftover = salary - savings - fixed;
      setText(root, '[data-tw-plan-month]', planMonthLabel()); setText(root, '[data-tw-plan-period]', planMonthLabel()); setText(root, '[data-tw-plan-period-remaining]', planRingMoney(state.planRemainingCents));
      renderPlanTable('[data-tw-plan-assets]', state.planAssets, '[data-tw-plan-assets-total]', 'No accounts yet. Tap to add one.');
      renderPlanTable('[data-tw-plan-investments]', state.planInvestments, '[data-tw-plan-investments-total]', 'No investments yet. Tap to add one.');
      setText(root, '[data-tw-plan-wealth]', planRingMoney(assetsTotal + investmentsTotal)); setText(root, '[data-tw-plan-salary]', planMoney(salary)); setText(root, '[data-tw-plan-monthly-savings]', planMoney(savings)); setText(root, '[data-tw-plan-monthly-fixed]', planMoney(fixed)); setText(root, '[data-tw-plan-leftover]', planMoney(leftover)); setText(root, '[data-tw-plan-daily-leftover]', planMoney(state.planDailyLeftoverCents)); setText(root, '[data-tw-plan-bills]', planMoney(bills)); setText(root, '[data-tw-plan-daily-remaining]', planMoney(state.planRemainingCents));
    }

    function render() {
      var data = snapshot();
      setText(root, '[data-tw-balance]', money(data.remaining)); setText(root, '[data-tw-income]', money(data.income)); setText(root, '[data-tw-expenses]', money(data.expenses)); setText(root, '[data-tw-daily-today]', money(data.dailyToday)); setText(root, '[data-tw-after-fixed]', money(data.afterFixed)); setText(root, '[data-tw-utilities]', money(data.utilities)); setText(root, '[data-tw-remaining]', money(data.remaining));
      var percent = data.income ? Math.max(0, Math.round(data.remaining / data.income * 100)) : 0; setText(root, '[data-tw-remaining-percent]', percent + '% of total'); setText(root, '[data-tw-donut-percent]', percent + '%');
      var ratio = data.income ? Math.max(0, Math.min(1, data.remaining / data.income)) : 0; var donut = root.querySelector('.tw-donut'); if (donut) donut.style.background = 'conic-gradient(var(--tw-gold) 0deg,' + (ratio * 360) + 'deg,var(--tw-stone) ' + (ratio * 360) + 'deg, var(--tw-stone) 360deg)';
      [['savings', data.savings], ['fixed', data.fixed], ['daily', data.daily]].forEach(function (item) { setText(root, '[data-tw-budget-amount="' + item[0] + '"]', money(item[1])); });
      renderRows(); renderPlan();
    }

    function showPanel(name) {
      state.activePanel = name;
      root.querySelectorAll('[data-tw-panel]').forEach(function (panel) { var active = panel.dataset.twPanel === name; panel.hidden = !active; panel.classList.toggle('is-active', active); });
      root.querySelectorAll('[data-tw-tab]').forEach(function (button) { var active = button.dataset.twTab === name; button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); });
      if (name === 'plan') {
        var loading = root.querySelector('[data-tw-plan-loading]'); var ready = root.querySelector('[data-tw-plan-ready]');
        loading.hidden = false; ready.hidden = true; window.clearTimeout(state.planTimer);
        state.planTimer = window.setTimeout(function () { loading.hidden = true; ready.hidden = false; renderPlan(); }, 650);
      }
    }

    function setAddType(type) {
      state.addType = type || 'expense';
      var labels = { expense: 'Add Expense', income: 'Add Salary', savings: 'Add Savings', utility: 'Add Utility', asset: 'Add Asset', investment: 'Add Investment' };
      var submit = { expense: 'Add expense', income: 'Add salary', savings: 'Add savings', utility: 'Add utility', asset: 'Add asset', investment: 'Add investment' };
      var defaults = { expense: ['Coffee', '12.50'], income: ['Salary', '1000'], savings: ['Savings transfer', '100'], utility: ['Electricity', '28.56'], asset: ['Asset account', '0'], investment: ['Investment', '0'] };
      setText(root, '[data-tw-add-heading]', labels[state.addType]); setText(root, '[data-tw-add-submit]', submit[state.addType]);
      root.querySelectorAll('[data-tw-add-choice]').forEach(function (button) { var selected = button.dataset.twAddChoice === state.addType; button.classList.toggle('is-selected', selected); button.setAttribute('aria-pressed', String(selected)); });
      var category = root.querySelector('[data-tw-category-field]'); if (category) category.hidden = state.addType !== 'expense';
      addForm.querySelector('[name="description"]').value = defaults[state.addType][0]; addForm.querySelector('[name="amount"]').value = defaults[state.addType][1];
    }
    function openSheet(trigger, type) { state.lastFocus = trigger || document.activeElement; sheet.hidden = false; setAddType(type || 'expense'); window.setTimeout(function () { addForm.querySelector('[name="description"]').focus(); }, 0); }
    function closeSheet() { sheet.hidden = true; if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus(); state.lastFocus = null; }
    function resetPlanSnapshot() { state.planMonthOffset = 0; state.planAssets = []; state.planInvestments = [{ name: 'public bank', amountCents: 6000000 }]; state.planSalaryCents = 500000; state.planSavingsCents = 0; state.planFixedCents = 0; state.planDailyLeftoverCents = 300000; state.planBillsCents = 101800; state.planRemainingCents = 396500; renderPlan(); }

    setText(root, '[data-tw-period-label]', monthNames[now.getMonth()] + ' ' + now.getFullYear());
    root.querySelectorAll('[data-tw-tab]').forEach(function (button) { button.addEventListener('click', function () { showPanel(button.dataset.twTab); }); });
    root.querySelectorAll('[data-tw-open-add]').forEach(function (button) { button.addEventListener('click', function () { openSheet(button, button.dataset.twAddType); }); });
    root.querySelectorAll('[data-tw-add-choice]').forEach(function (button) { button.addEventListener('click', function () { setAddType(button.dataset.twAddChoice); }); });
    root.querySelector('[data-tw-close]').addEventListener('click', closeSheet); root.querySelector('[data-tw-sheet-backdrop]').addEventListener('click', closeSheet); root.querySelector('[data-tw-search]').addEventListener('input', function (event) { state.filter = event.target.value; renderRows(); });
    root.querySelector('[data-tw-report-utility]').addEventListener('click', function () { openSheet(this, 'utility'); }); root.querySelector('[data-tw-wifi]').addEventListener('click', function () { setText(root, '[data-tw-wifi-status]', 'Not connected'); }); root.querySelector('[data-tw-enable]').addEventListener('click', function () { this.textContent = 'Unavailable'; });
    root.querySelector('[data-tw-plan-prev]').addEventListener('click', function () { state.planMonthOffset -= 1; renderPlan(); }); root.querySelector('[data-tw-plan-next]').addEventListener('click', function () { state.planMonthOffset += 1; renderPlan(); }); root.querySelector('[data-tw-plan-refresh]').addEventListener('click', function () { resetPlanSnapshot(); if (status) status.textContent = 'plan refreshed'; });
    root.querySelectorAll('[data-tw-plan-overview]').forEach(function (button) { button.addEventListener('click', function () { if (status) status.textContent = button.dataset.twPlanOverview + ' overview selected'; }); });
    root.querySelector('[data-tw-reset]').addEventListener('click', function () { state.entries = []; state.filter = ''; root.querySelector('[data-tw-search]').value = ''; resetPlanSnapshot(); showPanel('home'); render(); if (status) status.textContent = 'demo reset'; });
    root.querySelectorAll('[data-tw-budget-row]').forEach(function (button) { button.addEventListener('click', function () { state.selectedBudget = button.dataset.twBudgetRow; render(); }); });
    root.querySelectorAll('[data-tw-toggle]').forEach(function (toggle) { toggle.addEventListener('change', function () { if (status) status.textContent = toggle.checked ? 'setting enabled' : 'setting disabled'; }); });
    addForm.addEventListener('submit', function (event) {
      event.preventDefault(); var form = new FormData(addForm); var amount = Math.round(Number(form.get('amount')) * 100); if (!Number.isFinite(amount) || amount <= 0) return;
      var type = state.addType; var description = String(form.get('description') || 'Entry').trim() || 'Entry';
      if (type === 'asset') state.planAssets.push({ name: description, amountCents: amount }); else if (type === 'investment') state.planInvestments.push({ name: description, amountCents: amount });
      state.entries.push({ description: description, amountCents: amount, kind: type, category: type === 'income' ? 'income' : type === 'savings' ? 'savings' : type === 'utility' ? 'utility' : type === 'asset' ? 'asset' : type === 'investment' ? 'investment' : String(form.get('category') || 'daily'), date: 'Today' });
      closeSheet(); render(); if (status) status.textContent = 'saved in this demo';
    });
    render();
    window.setTimeout(function () { root.querySelector('[data-tw-boot]').classList.add('is-hidden'); }, 550);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
