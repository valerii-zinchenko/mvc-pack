'use strict';

suite('AFState', function(){
	suite('incorrect input argument', function(){
		suite('type of Constructors', function(){
			[
				undefined,
				null,
				false,
				true,
				0,
				1,
				'',
				'str',
				[],
				function(){}
			].forEach(function(testCase){
				test(JSON.stringify(testCase), function(){
					assert.throw(function(){
						AFState(testCase);
					}, Error, 'Incorrect type of the constructors. Object expected.');
				});
			});
		});

		suite('type of Constructors.View', function(){
			[
				undefined,
				null,
				false,
				true,
				0,
				1,
				'',
				'str',
				[],
				{}
			].forEach(function(testCase){
				test(JSON.stringify(testCase), function(){
					assert.throw(function(){
						AFState({View: testCase});
					}, Error, 'Incorrect type of a view\'s constructor. Expected: Function');
				});
			});
		});

		suite('type of Constructors.Control', function(){
			[
				true,
				1,
				'str',
				[],
				{}
			].forEach(function(testCase){
				test(JSON.stringify(testCase), function(){
					assert.throw(function(){
						AFState({
							View: function(){},
							Control: testCase
						});
					}, Error, 'Incorrect type of a control\'s constructor. Expected: Function');
				});
			});
		});
	});

	suite('correct arguments', function(){
		[
			{
				View: function(){}
			},
			{
				View: function(){},
				Constrol: function(){}
			},
			{
				View: function(){},
				Decorators: {
					Deco: function(){},
					notdeco: '123'
				}
			},
			{
				View: function(){},
				Constrol: function(){},
				Decorators: {
					Deco: function(){}
				}
			}
		].forEach(function(testCase){
			test(JSON.stringify(testCase), function(){
				assert.doesNotThrow(function(){
					AFState(testCase);
				});
			});
		});
	});

	suite('State builder. Integration tests with State', function(){
		setup(function(){
			sinon.spy(AStateComponent.prototype, "connect");
		});
		teardown(function(){
			AStateComponent.prototype.connect.restore();
		});

		test('without model in input arguments', function(){
			var result;
			assert.throw(function(){
				result = (AFState({View: AView}))();
			}, Error, 'Incorrect type of the model. Expected: Object');
		});

		test('without ControlConstructor', function(){
			var model = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState({View: AView}))(model);
			});

			assert.isNotNull(result.view, 'View component of the state was not setup');
			assert.equal(result.view.model, model, 'Model was incorrectly set');
		});

		test('with ControlConstructor', function(){
			var model = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState({
					View: AView,
					Control: AControl
				}))(model);
			});

			assert.isNotNull(result.view, 'View component of the state was not setup');
			assert.isNotNull(result.control, 'Control component of the state was not setup');
			assert.equal(result.control.model, model, 'Model was incorrectly set');
		});

		test('with Decorators', function(){
			var Deco = new Class(ADecorator, {
				initialize: sinon.stub()
			});
			var incorrectDeco = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState({
					View: AView,
					Decorators: {
						Deco: Deco,
						incorrectDeco: incorrectDeco
					}
				}))({});
			});

			assert.isTrue(Deco.prototype.initialize.calledOnce, 'Decorator should be created in the state builder');
			assert.instanceOf(result._decorators.Deco, Deco, 'Decorator was incorrectly set');
			assert.isUndefined(result._decorators.incorrectDeco, 'Incorrect docarator should not be passed further to a state constructor');
		});

		test('state\'s configuration', function(){
			var config = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState({
					View: AView,
					Control: AControl
				}))({}, config);
			});

			assert.equal(result.view.config, config, 'Configuration was incorrectly set to the view');
			assert.equal(result.control.config, config, 'Configuration was incorrectly set to the control');
		});
	});
});
