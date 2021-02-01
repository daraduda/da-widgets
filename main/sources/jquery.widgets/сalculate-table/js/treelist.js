{
	let step = 1;
	const isVisibleNull = true;

	function InitTableLevels() {
		initLevels();

		$('td').on('click',
			function (e) {
				let nextAllLevels = $(e.target).parents('tr').nextAll();
				let levelNext, isLastChildLevel, childIcon, childLevel, isIconCollapse;
				const currentIcon = $(e.target).parent().find('i');
				const currentLevel = getLevel($(e.target).parent());
				const isCurrentIconCollapse = currentIcon.hasClass('icon-collapse');

				$.each(nextAllLevels,
					function (index, element) {
						levelNext = getLevel($(element).find('div.ceg'));

						if (levelNext === (currentLevel + 1)) {
							childIcon = $(element).find('div.ceg i');
							childLevel = getLevel($(element).next().find('div.ceg'));
							isIconCollapse = childIcon.hasClass('icon-collapse');

							if (isIconCollapse && isCurrentIconCollapse || childIcon.length === 0) {
								$(element).show();
								expandedLevel(currentIcon);

								if (levelNext < childLevel) isLastChildLevel = false;

								if (levelNext === childLevel || isLastChildLevel) {
									removeIconLevel(childIcon);
									isLastChildLevel = true;
								}
							} else {
								$(element).hide();
								collapsedIcon(currentIcon);
								collapsedIcon(childIcon);
								nextAllLevels = $(element).nextAll();
								collapsedLevels(nextAllLevels, currentLevel);
								currentIcon.addClass('icon-collapse');
								currentIcon.removeClass('icon-expand');
								childIcon.addClass('icon-collapse');
								childIcon.removeClass('icon-expand');
								return false;
							}
						} else if (levelNext === currentLevel)
							return false;
					});
			});

		calculateValuesOfTableCells();
	}

	function initLevels() {
		let max = 0;
		const allLevels = $('div.ceg');

		allLevels.find('i').remove();
		step = 1;

		$.each(allLevels,
			function (index, element) {
				const $element = $(element);
				const number = getLevel($(element));
				const text = $element.text().trim();

				$element.empty();
				$element.append(`<span>${text}</span>`);

				if (number)
					max = Math.max(number, max);
			});

		for (let i = 0; i <= max; i++)
			createLevel(`ceg-${i}`);
	}

	function createLevel(levelName) {
		$('div.' + levelName)
			.prepend(`<i class='zmdi zmdi-caret-right ${levelName} icon-collapse'></i>`);

		$('td.ceg-0').parent().show();

		$('tr div.' + levelName).each(function () {
			const $element = $(this);
			const firstTd = $element.parent().first();

			!firstTd.hasClass('ceg-0')
				? $(firstTd).css('padding-left', String(20 * step) + 'px')
				: step--;

			if (!$element.hasClass('has-child') && getLevel($element) <= 1) {
				$(firstTd).css('padding-left', '40px');
				$element.find('i').remove();
				$element.parents('td').css('cursor', 'inherit');
			}
		});

		step++;
		restoreLevel(levelName);
	}

	function getLevel($target) {
		if (!$target.attr('class')) return;

		return parseInt($target.attr('class')
			.match(/\d+/g));
	}

	function restoreLevel(levelName) {
		if ($('i.' + levelName).hasClass('icon-collapse'))
			$('tr div.' + levelName).parents('tr').hide();
	}

	function collapsedLevels(nextAllLevels, currentLevel) {
		$.each(nextAllLevels,
			function (index, childElement) {
				const childIcon = $(childElement).find('div.ceg i');
				const levelNext = getLevel($(childElement).find('div.ceg'));

				if (levelNext > currentLevel) {
					$(childElement).hide();
					collapsedIcon(childIcon);
				} else
					return false;
			});
	}

	function calculateLevels(levels) {
		initLevels();

		if (levels === 0) {
			let calculateResult = false;

			$.each($('tr'),
				function (index, element) {
					const $element = $(element);
					const isDataCost = $(element).find('td div.ceg').attr('data-has-cost');
					const iconLevel = $(element).find('div.ceg i');

					if (isDataCost === "True" && getLevel(iconLevel) > 1) {
						$element.show();
						calculateResult = true;
						removeIconLevel(iconLevel);
						autoExpandLevels($element, $element.prevAll(), true);
						autoExpandLevels($element, $element.nextAll());
					}
				});

			if (calculateResult) return;

			levels = 2;
		}

		for (let i = 0; i <= levels; i++) {
			const $elements = $(`td.ceg-${i}`);

			$.each($elements,
				function (index, element) {
					const $element = $(element);
					const $currentElement = $element.parent();
					const currentLevel = getLevel($element);
					const nextLevel = getLevel($element.parent().next().find('div.ceg'));

					$currentElement.show();

					if (i < levels)
						expandedLevel($currentElement.find('div.ceg i'));

					if (currentLevel >= nextLevel)
						removeIconLevel($element.find('i'));
				});
		}
	}

	function autoExpandLevels($currentElement, $list, isPrevList) {
		let isEndExpandedLevel;
		let maxLevel = getLevel($currentElement.find('div.ceg'));
		const minCurrent = maxLevel;

		$.each($list,
			function (index, element) {
				const $element = $(element);
				const $selectorDivCeg = $element.find('div.ceg');
				const $selectorDivCegIcon = $selectorDivCeg.find('i');
				const numberLevel = getLevel($selectorDivCeg);

				if (numberLevel === 0) {
					if (isPrevList)
						expandedLevel($selectorDivCegIcon);

					return false;
				}

				maxLevel = Math.min(maxLevel, numberLevel);

				if (numberLevel <= maxLevel) {
					$element.show();

					if (isPrevList && !isEndExpandedLevel)
						expandedLevel($selectorDivCegIcon);

					if (minCurrent === maxLevel)
						removeIconLevel($selectorDivCegIcon);
				} else
					isEndExpandedLevel = true;
			});
	}

	function collapsedIcon(icon) {
		icon.removeClass('zmdi-caret-down icon-expand');
		icon.addClass('zmdi-caret-right icon-collapse');
	}

	function removeIconLevel(icon) {
		icon.removeClass('zmdi-caret-right');
		icon.removeClass('zmdi-caret-down');
		icon.removeClass('icon-collapse');
		icon.parents('td').css('cursor', 'inherit');
	}

	function expandedLevel(icon) {
		icon.removeClass('zmdi-caret-right icon-collapse');
		icon.addClass('zmdi-caret-down icon-expand');
	}

	const calculateValuesOfTableCells = () => {
		let obj = {};
		const rows = $('.plan-version-table tbody tr');
		$.each(rows,
			function (index, element) {
				let cellValue;
				let cells = [];
				const $item = $(element);
				const currentLevel = getLevel($item.find('div.ceg'));
				const nextLevel = getLevel($item.next().find('div.ceg'));
				const dataCurrencyKey = $item.attr('data-currency-key');
				const dataCurrentCurrencyKey = $('#currency-data-id').attr('data-currency-key');
				const dataCurrentEuroRateValue = parseFloat($('#currency-data-id').attr('data-euro-rate-value'));
				const dataEuroRateValue = $item.attr('data-currency-euro-rate') ? parseFloat($item.attr('data-currency-euro-rate').replace(/,/, '.')) : undefined;
				$.each($item.find('td'),
					function (indexTd, elementTd) {
						if (indexTd > 1) {
							// if($item.find('td:nth-child(2)').text().trim() === "Shirt3"){
							// 	debugger
							// }

							let value = $(elementTd).text().trim().replace(/,/g, '');
							let isCalculateField = !isNaN(parseFloat(value));
							let originalValue = value.slice(0);
							cellValue = parseFloat((value.includes('%') ? 0 : value) || '');
							value = isNaN(cellValue) ? '' : cellValue;
							// if (dataCurrencyKey !== 'EUR' && dataCurrencyKey !== dataCurrentCurrencyKey && value !== 0 && value !== '') {
							// 	value = value * (dataCurrentEuroRateValue / dataEuroRateValue);
							// 	//TODO: test function - applay change for currency
							// 	//appendData($(elementTd), numeralFormat(value));
							// }

							if (currentLevel < nextLevel && isCalculateField) {
								appendData($(elementTd), '');
								value = 0;
								isCalculateField = false;
							}

							cells[indexTd] = [$(elementTd), value, isCalculateField, originalValue];
						}
					});
				obj[`${index}`] = {
					hasChild: currentLevel < nextLevel,
					level: currentLevel,
					name: $item.find('td:nth-child(2)').text().trim(),
					cells
				}
			});
		const currentRoot = calculateChildrenCells(obj);
		calculateParentsCells(obj, currentRoot);
	}

	const calculateChildrenCells = (obj) => {
		let currentRoot;
		const objLength = Object.keys(obj).length;

		for (let objIndex = 0; objIndex < objLength; objIndex++) {
			let groupCellsArray = [];
			const item = obj[objIndex];
			const cells = item.cells;
			const currentLevel = item.level;

			if (item.hasChild) {
				currentRoot = item;
			}

			let stepIndex = 0;

			for (let childObjIndex = objIndex; childObjIndex < objLength; childObjIndex++) {
				let cellsArray = [];

				for (let cellIndex = 2; cellIndex < cells.length; cellIndex++) {
					const nextLevel = obj[childObjIndex].level;

					if (currentLevel !== nextLevel || !obj[childObjIndex].cells) break;

					if (obj[childObjIndex].cells[cellIndex]) {
						const value = obj[childObjIndex].cells[cellIndex][1];
						const isCalculateField = obj[childObjIndex].cells[cellIndex][2];
						const originalValue = obj[childObjIndex].cells[cellIndex][3];
						cellsArray.push([value, isCalculateField, originalValue]);
					}
				}

				if (cellsArray.length !== 0) {
					groupCellsArray[stepIndex++] = cellsArray;
				} else {
					objIndex = childObjIndex - 1;
					break;
				}
			}

			if (groupCellsArray.length !== 0) {
				calculateCells(groupCellsArray, currentRoot, true);
			}
		}

		return currentRoot;
	}

	const calculateParentsCells = (obj, currentRoot) => {
		let isCalculateEnd;
		const objLength = Object.keys(obj).length;

		for (let levelIndex = 1; levelIndex >= 0; levelIndex--) {
			for (let objIndex = 0; objIndex < objLength; objIndex++) {
				let groupCellsArray = [];
				const item = obj[objIndex];
				const cells = item.cells;
				const currentLevel = item.level;

				if (item.hasChild && currentLevel === levelIndex) {
					currentRoot = item;
				}

				if (item.hasChild) {
					let stepIndex = 0;

					for (let childObjIndex = objIndex; childObjIndex < objLength; childObjIndex++) {
						let cellsArray = [];

						if (item.hasChild && currentRoot.level < currentLevel) {
							for (let cellIndex = 2; cellIndex < cells.length; cellIndex++) {
								if (obj[childObjIndex].cells[cellIndex]) {
									const value = obj[childObjIndex].cells[cellIndex][1];
									const originalValue = obj[childObjIndex].cells[cellIndex][3];
									const isCalculate = !(originalValue === '' && value === '');
									cellsArray.push([value, isCalculate , originalValue]);
								}
							}

							if (cellsArray.length !== 0 &&
								obj[childObjIndex].hasChild &&
								obj[childObjIndex].level === currentRoot.level + 1) {
									groupCellsArray[stepIndex++] = cellsArray;
							} else if (cellsArray.length === 0
								|| obj[childObjIndex].level === currentRoot.level) {
									objIndex = childObjIndex - 1;
									break;
							}

							isCalculateEnd = childObjIndex === objLength - 1;
						}
					}

					if (groupCellsArray.length != 0) {
						calculateCells(groupCellsArray, currentRoot);

						if (isCalculateEnd) break;
					}
				}
			}
		}
	}

	const calculateCells = (array, currentRoot, isChild) => {
		let currentArray = [];

		for (let i = 0; i < array[0].length; i++) {
			const result = array.reduce((acc, cur) => cur[i][0] !== '' ? acc + cur[i][0] : acc, 0);
			const isCalculate = array.some(x => x[i][1]) || !!result || array[0][i][0] === 0 && array[0][i][1];
			currentArray.push([result, isCalculate, array[0][i][2]]);
		}

		if (currentArray.length === 0) return;

		$.each($(currentRoot.cells),
			function (index, element) {
				if (!element) return;
				const $element = $(element);
				const $item = $element[0];
				const itemArray = currentArray[index - 2];

				if (itemArray[1] && index !== 2) {
					const value = numeralFormat(itemArray[0]);
					appendData($item, value === '0.00' && !isVisibleNull ? '' : value);
					currentRoot.cells[index][1] = itemArray[0];
				}
			});
	}

	const numeralFormat = (data, decimalDigits) => {
		return data.toLocaleString('en-US', { minimumFractionDigits: decimalDigits, maximumFractionDigits: decimalDigits });
	};

	const appendData = (item, value) => {
		const child = $(item).children();

		child.length > 0
			? child.empty().append(value)
			: item.empty().append(value);
	}
}