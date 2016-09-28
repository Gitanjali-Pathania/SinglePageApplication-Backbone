//d3 chart
    bubble1 = function(){
                              

              var chart = function(selection){
                              width = parseInt(d3.select('#'+containerId).style('width'));
                              height = parseInt(d3.select('#'+containerId).style('height'));

                              // set the ranges
                                var x = d3.scale.ordinal().rangeRoundBands([20, 100], .1);

                                var y = d3.scale.linear().range([height-100, 0]);

                                // define the axis
                                var xAxis = d3.svg.axis()
                                    .scale(x)
                                    .orient("bottom")


                                var yAxis = d3.svg.axis()
                                    .scale(y)
                                    .orient("left")
                                    .ticks(10);

                                  
                                     selection.each(function(data){
                                    

                                                                    data.forEach(function(d) {
                                        d.Letter = d.Letter;
                                        d.Freq = +d.Freq;
                                    });
                                  
                                  // scale the range of the data
                                  x.domain(data.map(function(d) { return d.Letter; }));
                                  y.domain([0, d3.max(data, function(d) { return d.Freq; })]);

                                  // add axis
                                   var container = d3.select(this)
                                                                                .attr('width',width)
                                                                                .attr('height',height)
                                  container.append("g")
                                      .attr("class", "x axis")
                                      .attr("transform", "translate(0," + (height-100) + ")")
                                      .call(xAxis)
                                    .selectAll("text")
                                      .style("text-anchor", "end")
                                      .attr("dx", "-.8em")
                                      .attr("dy", "-.55em")
                                      .attr("transform", "rotate(-90)" );

                                  container.append("g")
                                      .attr("class", "y axis")
                                      .call(yAxis)
                                    .append("text")
                                      .attr("transform", "rotate(-90)")
                                      .attr("y", 5)
                                      .attr("dy", ".71em")
                                      .style("text-anchor", "end")
                                      .text("Frequency");


                                  // Add bar chart
                                  container.selectAll("bar")
                                      .data(data)
                                    .enter().append("rect")
                                      .attr("class", "bar")
                                      .attr("x", function(d) { return x(d.Letter); })
                                      .attr("width", x.rangeBand())
                                      .attr("y", function(d) { return y(d.Freq); })
                                      .attr("height", function(d) { return (height-100) - y(d.Freq); });
                                                                                 });
                                                                              }           

                                 chart.containerId = function(_){
                                            if(!arguments.length)
                                               return containerId;

                                            containerId = _;

                                            return chart;
                                        };

                                return chart;

    }


	// Create a model for the services
	var Service = Backbone.Model.extend({

		defaults:{
			question: '',
			answer: '',
			option1:'',
			option2:''
		}
	});
	// Create a collection of services
	var ServiceList = Backbone.Collection.extend({

		model: Service

	});
var responseObj=[],answerObject=[],chartData=[];

	// Prefill the collection with a number of services.
	var services = new ServiceList([
		new Service({ question: 'Silicon Valley of India?', answer: "bangalore", option1: "bangalore", option2: "Delhi"}),
		new Service({ question: 'Top IT Company in terms of Revenue?', answer: "microsoft", option1: "Facebook", option2: "microsoft"}),
		new Service({ question: 'Whether India has more than 20,000 Companies/startups?', answer: "yes", option1: "yes", option2: "no"}),
		new Service({ question: 'Which sector has most happening jobs in India?', answer: "IT", option1: "IT", option2: "government"}),
		new Service({ question: 'Are you in Bangalore?', answer: "yes", option1: "yes", option2: "no"})
		// Add more here
	]);



	// The main view of the application
	var App = Backbone.View.extend({
		el: $('#main'),
		questionnaire:0,
		initialize: function(){
   var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

			this.chartObject=bubble1().containerId('abc');

                this.svg = d3.select('#abc').append('svg')
    .attr('width',width)
      .attr('height',height)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

		},
		events: {
              'click #next':'next',
              'click .radiobtn':'startQAFun'
        },
        next:function(){
            var question=services.models[this.questionnaire].attributes.question,
              option1=services.models[this.questionnaire].attributes.option1,
              option2=services.models[this.questionnaire].attributes.option2,
              answer=services.models[this.questionnaire].attributes.answer;
            this.$el.html('<p style="padding-left:15% ! important;padding-bottom: 3%;padding-top:1%"><label style="color:#63D0DF;">'+question+'</label><p style="margin-left:18%"><input type="radio" id="first" value="'+option1+'" name="radiobtn" class="option-input radiobtn r_'+this.questionnaire+'"><label for="first" >'+option1+'</label><input type="radio" name="radiobtn" class="option-input radiobtn r_'+this.questionnaire+'" value="'+option2+'" id="second" style="margin-left: 104px;"><label for="second" >'+option2+'</label><br></p></p> ')
            answerObject.push(answer);
            this.questionnaire++;
        },
        startQAFun: function(){
                  responseObj.push($('.radiobtn:checked').val());
                if(services.models[this.questionnaire] && this.questionnaire < 5){

                  var question=services.models[this.questionnaire].attributes.question,
                    option1=services.models[this.questionnaire].attributes.option1,
                    option2=services.models[this.questionnaire].attributes.option2,
                    answer=services.models[this.questionnaire].attributes.answer;
                    answerObject.push(answer);
                  this.$el.html('<p style="padding-left:15% ! important;padding-bottom: 3%;padding-top:1%"><label style="color:#63D0DF;">'+question+'</label><p style="margin-left:18%"><input type="radio" id="first" value="'+option1+'" name="radiobtn" class="option-input radiobtn r_'+this.questionnaire+'"><label for="first" >'+option1+'</label><input type="radio" name="radiobtn" class="option-input radiobtn r_'+this.questionnaire+'" value="'+option2+'" id="second" style="margin-left: 104px;"><label for="second" >'+option2+'</label><br></p></p> ')
  
                  
                }
              this.questionnaire++;
               if(this.questionnaire == 6){
                this.renderChart()
              }
        		
		},
		renderChart:function(){
			var rightAnswers=0,wrongAnswers=0;
			for(var i = answerObject.length; i--;) {
				if(answerObject[i] == responseObj[i]){
					rightAnswers=rightAnswers+1;
				}
				else wrongAnswers=wrongAnswers+1;
			}
			console.log(wrongAnswers);
			console.log(rightAnswers);
			var d1=[
			
{
	"Letter": "Correct",
	"Freq": rightAnswers	
},
{
	"Letter" : "InCorrect",
	"Freq": wrongAnswers
}
];
			 this.svg.datum(d1).call(this.chartObject); 
			 var ob=services.models;
			 var q,a,o;
			 var str='<tr><th>Questions</th><th>Your Answer</th><th>Correct Answer</th></tr>';
			 ob.forEach(function(d,i){
			 	console.log(d['attributes'].question)
			 	q=d['attributes'].question;
			 	a=d['attributes'].answer;
			 	o=responseObj[i];

			 	str += '<tr><td>'+q+'</td><td>'+o+'</td><td>'+a+'</td></tr>';
			 })

                	 $('#myTable').html(str);                 
                	 $('#abc').css('background-color','white');
                	 $('#abc1').css('background-color','white');
		},
		render: function(question){

			return this;

		}

	});

	new App();










