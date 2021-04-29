const roleId = $('#role_id').val();

// ----------------------------------------------------- GET DATA //
const getData = () => {
	$('.spinner').show();

	$.getJSON('/ajax/bunny/get_bunnies', {
			startDate: $("input[name='start_date']").val(),
			endDate: $("input[name='end_date']").val(),
		},
		data => {
			$('body').off('hover');
			initGraph(data.bunny_data);
			$('.spinner').hide();
		}
	);
};

// ----------------------------------------------------- BUNNY GRAPH //
const initGraph = buns => {
	// Set negative numbers to zero //
	Object.keys(buns).forEach(date => {
		buns[date] = buns(date) > 0 ? buns[date] : 0;
	});

	buns.forEach((bun, index) => {
		chart += '<div class="bun">';
		chart += `<div class="name">${bun.name}</div>`;
		chart += `<div class="value">${bun.revenue}</div>`;
		chart += '<div class="progress-container">';
		chart += `<div class="progress-bar" style="width: ${bun.y} %; background-color: ${graphColor[index]}"></div>`;
		chart += '</div>';
		chart += '</div>';
	});

	$('.buns-graph').html(chart);

	const options = {
		chart: {
			backgroundColor: '#000000',
			data: Object.values(buns),
			height: 317,
			margin: [0, 0, 0, 0],
			renderTo: 'bun-graph',
			type: 'bar',
		},
		tooltip: {
			enabled: true,
			formatter() {
        const value = this.y.toFixed(2).replace(/(\d) (?=(\d\d\d)+(?!\d))/g, '$1,');
				let html = `<strong>${Object.keys(buns)[this.key]}</strong>`;
				html += '<br>';
				html += `<strong>$${value}</strong>`;

				return html;
			},
		},
		legend: {
			enabled: false,
		},
	};

	chart = new Highcharts.Chart(options);
}

window.onkeydown = function(e) {
	return !(e.keyCode === 32 && e.target === document.body);
};
