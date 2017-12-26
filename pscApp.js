/**
 * PSC - Multi Projects Creation
 */
$(document).ajaxStart(function(){
	$('.vzuui-alertMsg_holder-mse').find('.msg').hide();
});
$(document).ajaxComplete(function() {

});
$(function(){
	if($('#form2Next').length > 0){
		document.getElementById('form2Next').addEventListener('click',function(){
			if(typeof pscApp != 'undefined'){
				pscApp.addLocationsInDropDown1();
			}
		});
	}
});
var projectOwnerId = "";
var _country;
var pscApp = (function(){
	return{
		clliObject : null,
		big4DataList : null,
		projectName : null,
		projectDescription:null,
		enggDisciplineData : [],
		networkType : [],
		globalQuestionsArray :[],
		globalClliArray : [],
		projectType : [],
		ownerName:null,
		payloadObject : {},
		clliQuestionsTablePSC : null,
		projectName : null,
		projectDesc : null,
		parentNetworkActivity:null,
		parentEnggDiscip : null,
		parentNetworkType : null,
		parentProjectType : null,
		componentValue : '',
		big4DataMSE : [],
		holidayList : [],
		nfTreeUrl : '',
		nfid : '',
		globalOwnerName: null,
		lobValue : null,
		stateSelectedSearch : null,
		flagErrorMessage : false,
		actualCilliCodes : [], 
		userVzId : '',
		advanceSearchTable : {},
		aaData : [],
		programNameId : '',
		programPhaseId : '',
		clliResultsTable : {},
		serviceDescriptorDetails : [],
		projectTypeObjExternal : {},
		projectTypeExternalRef : null,
		projectTypeExternalMainRef : null,
		managementIPTemplates : [],
		systemDetails : {},
		allSubprojects :[],
		clliPrjName : [],
		lastRow:null,
		_combOfprojectName :'',
		isMultiBuild : false,
		questionKeys : {
			"14": "dcPower",
            "15": "hvac",
            "16": "generator",
            "17": "acService",
            "18": "other",
            "1": "telemetryRequired",
            "23": "criticalPath"
		},
		compare : function (el1, el2, index) {
			  return el1[index] == el2[index] ? 0 : (el1[index] < el2[index] ? -1 : 1);
		},
		addLocationsInDropDown1 : function(){
			var _this = this;
			_this.clliObject = (typeof aaData != 'undefined')?aaData:[];
			$('#pscTable').find('.mseClliCodes').each(function(i){
				var _selectedIndex = $(this).prop('selectedIndex'),_value = $(this).val(),_html = '';
				$.each(_this.clliObject,function(index,value){
					if(value.CLLI == _value){
						_html += '<option value="'+value.CLLI+'" selected="selected">'+value.CLLI+'</option>';
					} else {
						_html += '<option value="'+value.CLLI+'">'+value.CLLI+'</option>';
					}
				});
				$(this).html(_html);
			});
			_this.showMessage('success','Locations Added Successfully');
			setTimeout(function(){ $('.vzuui-alertMsg_holder-mse').slideUp(); },2000);
			$('#home-tab').find('a').trigger('click');
			$(window).scrollTop(0);
			_this.hideLoader();
		},
		showLoader : function(){
			if(!$('.overlay-mse').is(':visible')){
				$('.overlay-mse').show();
			}
		},
		hideLoader : function(){
			if($('.overlay-mse').is(':visible')){
				$('.overlay-mse').hide();
			}
		},
		showLoader1NData : function(){
			if(!$('.overlay-1nData').is(':visible')){
				$('.overlay-1nData').show();
			}
		},
		hideLoader1NData : function(){
			$('.overlay-1nData').hide();
		},
		showLoader1NEquip : function(){
			if(!$('.overlay-1nEquip').is(':visible')){
				$('.overlay-1nEquip').show();
			}
		},
		hideLoader1NEquip : function(){
			$('.overlay-1nEquip').hide();
		},
		init : function(){
			var _this = this;
			this.clliObject = (typeof aaData != 'undefined')?aaData:[];
			this.getOrPostXMLHttpRequest({
				url : contextPath+'/rest/projectInitation/getBig4MSEBuild',
				type : 'GET',
				dataType : 'json',
				success : function(data){
					_this.big4DataList = (typeof data.big4Details != 'undefined' && !$.isEmptyObject(data.big4Details))?data.big4Details:[];
					_this.nfTreeUrl = (typeof _nfTreeUrl != 'undefined')?_nfTreeUrl:'';
					_this.enggDisciplineData = [];
					_this.networkType = [];
					_this.projectType = [];
					_this.getSystemDetails();
					var _projectTypeId = $.trim($('#projectType').val()),
					_serviceTypeId = $.trim($('#serviceType').val()),
					_engineeringDiscipline = $.trim($('#engDiscipline').val()),
					_networkActivity = $.trim($('#networkActivity').val()),
					_projectName = $.trim($('#projectName').val()),
					_projectDescription = $.trim($('#projectDesc').val()),
					_enggData = $.grep(_this.big4DataList,function(obj){ return obj.network_id == _networkActivity });
					_enggData.sort(function(el1,el2){ return _this.compare(el1, el2, "enggdiscip_name") });
					_this.projectNameForPopup = $.trim($('#projectName').val());
					_this.projectName = $.trim($('#projectName').val().replace(/&/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/"/g, ""));
					_this.projectDesc = $.trim($('#projectDesc').val().replace(/&/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/"/g, ""));
					_this.userVzId = (typeof userVZId != 'undefined')?userVZId:'';
					_this.programNameId = $.trim($('#programName').find('option:selected').val());
					_this.programPhaseId = $.trim($('#phase').find('option:selected').val());
					_this.parentNetworkActivity = _networkActivity;
					_this.parentEnggDiscip = _engineeringDiscipline;
					_this.parentNetworkType = _projectTypeId;
					_this.parentProjectType = _serviceTypeId;
					_this.big4DataMSE = _enggData;
					_this.attachEvents(_enggData,_networkActivity,_engineeringDiscipline,_projectTypeId,_serviceTypeId);
					var _aaData = [["","","","","","","",""]];
					var pscaaData=[];
					$.each(aaData,function(index,value){
						var obj=[];
						obj[0]=value.CLLI;obj[1]=value.CLLI;obj[2]=value.CLLI;obj[3]=value.CLLI;obj[4]=value.CLLI;obj[5]=value.CLLI;obj[6]=value.CLLI;obj[7]=value.CLLI;
						pscaaData.push(obj);
					});
					_this.createPSCDataTable(_engineeringDiscipline,_projectTypeId,_serviceTypeId,pscaaData);
					$('.overlay-mse').hide();
				},
				error : function(data){
					
				}
			});
			
		},
		getSystemDetails : function(){
			var _this = this;
			_this.getOrPostXMLHttpRequest({
				url : contextPath+'/rest/projectInitation/getSystemDetails?networkActivityId='+$.trim($('#networkActivity').val())+'&engineeringDiscipId='+$.trim($('#engDiscipline').val())+'&networkTypeId='+$.trim($('#projectType').val())+'&projectTypeId='+$.trim($('#serviceType').val()),
				type:'GET',
				dataType: "json",
				success : function(data){
					_this.systemDetails = data.systemDetails;
				},
				error : function(data){
					
				}
			});
		},
		attachEvents1NEquip : function(projectTypeObj){
			var _this = this;
			$(document).on('click','.vzuui-onOff_toggle_mse1N:not(.defaultVal),.vzuui-onOff_toggle_off_mse1N:not(.defaultVal)',function(event,flag){
				event.stopImmediatePropagation();
				var _questionKey = $(this).data('questionKey');
				if(!$(this).hasClass('vzuui-onOff_toggle_mse1N on'))  {
					$(this).next().prop('checked',false);
					$(this).removeClass("vzuui-onOff_toggle_off_mse1N").addClass("vzuui-onOff_toggle_mse1N on");
					if(_questionKey === 'telemetryRequired'){
						$('.telemetryDetails').hide();
					} else if(_questionKey === 'networkPlanRequired'){ 
						$('.networkplan').hide();
					}
				} else {
					$(this).next().prop('checked',true);
					$(this).removeClass("vzuui-onOff_toggle_mse1N on").addClass("vzuui-onOff_toggle_off_mse1N");
					if(_questionKey === 'telemetryRequired'){
						_this.doTelemetry1(projectTypeObj);
					} else if(_questionKey === 'networkPlanRequired'){
						$('.networkplan').show();
					}
				}
			});
			$(document).on('click', '.DelTeleRow', function () {
                var val = parseInt($(this).attr('id'), 10);
                var _tableData = $(this).closest('table').attr('data-table-data');
                var _dataFromTable = (typeof _tableData != 'undefined' && _tableData != "")?JSON.parse($(this).closest('table').attr('data-table-data')):[];
                if (typeof val === 'number') {
                	_dataFromTable.splice(val, 1);
                }
                $(this).closest('table').attr('data-table-data',JSON.stringify(_dataFromTable));
                var _tempData = JSON.parse($(this).closest('table').attr('data-table-data'));
                var tempHtml = ''
            	$.each(_tempData,function(index,value){
                	if (index % 2 === 0) {
                        tempHtml += '<tr class="even"><td>' + value.managementIPTemplateName + '</td><td>' + value.count + '</td><td>' + value.managementIPTemplateDetails.replace(/\n/g, "<br />") + '</td><td><button class="DelTeleRow" type="button" id="' + index + '">Delete</button></td></tr>'
                    } else {
                        tempHtml += '<tr class="odd"><td>' + value.managementIPTemplateName + '</td><td>' + value.count + '</td><td>' + value.managementIPTemplateDetails.replace(/\n/g, "<br />") + '</td><td><button class="DelTeleRow" type="button" id="' + index + '">Delete</button></td></tr>'
                    }
                });
                $(this).closest('table').find('tbody').html(tempHtml);
            });
			$(document).on('click', '.addTeleRow', function () {
				if($.trim($(this).closest('.row').find('.IP_quatity').val()) != ""){
	                var ManagementIPTemplateId = $(this).closest('.row').find('.managementIPTemplates-id').val();
	                var ManagementIPTemplateName = $(this).closest('.row').find('.managementIPTemplates').val();
	                var count = parseInt($(this).closest('.row').find('.IP_quatity').val(), 10);
	                var _tableData = $(this).closest('.row').next('.row').find('table').attr('data-table-data');
	                if (count != "" && ManagementIPTemplateId != "") {
	                	var _dataFromTable = (typeof _tableData != 'undefined' && _tableData != "")?JSON.parse(_tableData):[];
	                	var _dummyArray = [];
	                    if(typeof _dataFromTable != 'undefined' && _dataFromTable != ""){
	                    	var _inArray = $.grep(_dataFromTable, function(n) { return n.managementIPTemplateId == ManagementIPTemplateId; });
	                    	if(_inArray.length == 0){
		                    	$.each(_this.managementIPTemplates,function(index,value){
		                    		if(value.managementIPTemplateId == ManagementIPTemplateId){
		                    			value.count = count;
		                    			_dataFromTable.push(value);
		                    		}
		                    	});
	                    	} else {
	                    		$.each(_dataFromTable,function(index,value){
	                    			if(value.managementIPTemplateId == ManagementIPTemplateId){
	                    				_dataFromTable[index].count = parseInt(_dataFromTable[index].count)+parseInt(count);
	                    			}
	                    		});
	                    	}
	                    	$(this).closest('.row').next('.row').find('table').attr('data-table-data',JSON.stringify(_dataFromTable));
	                    } else {
	                    	$.each(_this.managementIPTemplates,function(index,value){
	                    		if(value.managementIPTemplateId == ManagementIPTemplateId){
	                    			value.count = count;
	                    			_dummyArray.push(value);
	                    		}
	                    	});
	                    	$(this).closest('.row').next('.row').find('table').attr('data-table-data',JSON.stringify(_dummyArray));
	                    }
	                    var _tableData1 = $(this).closest('.row').next('.row').find('table').attr('data-table-data');
	                    var _tempData = (typeof _tableData1 != 'undefined' && _tableData1 != "")?JSON.parse(_tableData1):[];
	                    var tempHtml = '';
	                    $.each(_tempData,function(index,value){
	                    	if (index % 2 === 0) {
	                            tempHtml += '<tr class="even"><td>' + value.managementIPTemplateName + '</td><td>' + value.count + '</td><td>' + value.managementIPTemplateDetails.replace(/\n/g, "<br />") + '</td><td><button class="DelTeleRow" type="button" id="' + index + '">Delete</button></td></tr>'
	                        } else {
	                            tempHtml += '<tr class="odd"><td>' + value.managementIPTemplateName + '</td><td>' + value.count + '</td><td>' + value.managementIPTemplateDetails.replace(/\n/g, "<br />") + '</td><td><button class="DelTeleRow" type="button" id="' + index + '">Delete</button></td></tr>'
	
	                        }
	                    });
	                    $(this).closest('.row').next('.row').find('table > tbody').html(tempHtml);
	                } 
	                $(this).closest('.row').find('.managementIPTemplates').val("");
	                $(this).closest('.row').find('.managementIPTemplates-id').val("");
	                $(this).closest('.row').find('.IP_quatity').val("");
				}
            });
			$(document).on('click', '#form31NMSEquipNext', function () {
				if ($('.mse1NEquipForm').validationEngine('validate')) {
					_this.saveEquipmentProject();
				}
			});
			$(document).on('click','#form3Back1NMsequip',function(){
				$('.vzuui-alertMsg_holder-1nEquip').find('.msg').hide();
				project.processStep(this);
			});
			$(document).on('click','#form3Cancel1NMsequip',function(){
				window.location.reload(true);
			});
		},
		attachEvents1NEquipMB : function(projectTypeObj){
			var _this = this,_projectTypeObj = projectTypeObj;
			$(document).on('click','.vzuui-onOff_toggle_mse1N:not(.defaultVal),.vzuui-onOff_toggle_off_mse1N:not(.defaultVal)',function(event,flag){
				event.stopImmediatePropagation();
				var _questionKey = $(this).data('questionKey');
				if(!$(this).hasClass('vzuui-onOff_toggle_mse1N on'))  {
					$(this).next().prop('checked',false);
					$(this).removeClass("vzuui-onOff_toggle_off_mse1N").addClass("vzuui-onOff_toggle_mse1N on");
					if(_questionKey === 'telemetryRequired'){
						$(this).closest('.panel-body').find('.telemetryDetails').hide();
					} else if(_questionKey === 'networkPlanRequired'){
						$(this).closest('.panel-body').find('.networkplan').hide();
					}
				} else {
					$(this).next().prop('checked',true);
					$(this).removeClass("vzuui-onOff_toggle_mse1N on").addClass("vzuui-onOff_toggle_off_mse1N");
					if(_questionKey === 'telemetryRequired'){
						_this.doTelemetry($(this),_projectTypeObj);
					} else if(_questionKey === 'networkPlanRequired'){
						$(this).closest('.panel-body').find('.networkplan').show();
					}
				}
			});
			$(document).on('click', '.DelTeleRow', function () {
                var val = parseInt($(this).attr('id'), 10);
                var _tableData = $(this).closest('table').attr('data-table-data');
                var _dataFromTable = (typeof _tableData != 'undefined' && _tableData != "")?JSON.parse($(this).closest('table').attr('data-table-data')):[];
                if (typeof val === 'number') {
                	_dataFromTable.splice(val, 1);
                }
                $(this).closest('table').attr('data-table-data',JSON.stringify(_dataFromTable));
                var _tempData = JSON.parse($(this).closest('table').attr('data-table-data'));
                var tempHtml = ''
            	$.each(_tempData,function(index,value){
                	if (index % 2 === 0) {
                        tempHtml += '<tr class="even"><td>' + value.managementIPTemplateName + '</td><td>' + value.count + '</td><td>' + value.managementIPTemplateDetails.replace(/\n/g, "<br />") + '</td><td><button class="DelTeleRow" type="button" id="' + index + '">Delete</button></td></tr>'
                    } else {
                        tempHtml += '<tr class="odd"><td>' + value.managementIPTemplateName + '</td><td>' + value.count + '</td><td>' + value.managementIPTemplateDetails.replace(/\n/g, "<br />") + '</td><td><button class="DelTeleRow" type="button" id="' + index + '">Delete</button></td></tr>'
                    }
                });
                $(this).closest('table').find('tbody').html(tempHtml);
            });
			$(document).on('click', '.addTeleRow', function () {
				if($.trim($(this).closest('.row').find('.IP_quatity').val()) != ""){
	                var ManagementIPTemplateId = $(this).closest('.row').find('.managementIPTemplates-id').val();
	                var ManagementIPTemplateName = $(this).closest('.row').find('.managementIPTemplates').val();
	                var count = parseInt($(this).closest('.row').find('.IP_quatity').val(), 10);
	                var _tableData = $(this).closest('.row').next('.row').find('table').attr('data-table-data');
	                if (count != "" && ManagementIPTemplateId != "") {
	                	var _dataFromTable = (typeof _tableData != 'undefined' && _tableData != "")?JSON.parse(_tableData):[];
	                	var _dummyArray = [];
	                    if(typeof _dataFromTable != 'undefined' && _dataFromTable != ""){
	                    	var _inArray = $.grep(_dataFromTable, function(n) { return n.managementIPTemplateId == ManagementIPTemplateId; });
	                    	if(_inArray.length == 0){
		                    	$.each(_this.managementIPTemplates,function(index,value){
		                    		if(value.managementIPTemplateId == ManagementIPTemplateId){
		                    			value.count = count;
		                    			_dataFromTable.push(value);
		                    		}
		                    	});
	                    	} else {
	                    		$.each(_dataFromTable,function(index,value){
	                    			if(value.managementIPTemplateId == ManagementIPTemplateId){
	                    				_dataFromTable[index].count = parseInt(_dataFromTable[index].count)+parseInt(count);
	                    			}
	                    		});
	                    	}
	                    	$(this).closest('.row').next('.row').find('table').attr('data-table-data',JSON.stringify(_dataFromTable));
	                    } else {
	                    	$.each(_this.managementIPTemplates,function(index,value){
	                    		if(value.managementIPTemplateId == ManagementIPTemplateId){
	                    			value.count = count;
	                    			_dummyArray.push(value);
	                    		}
	                    	});
	                    	$(this).closest('.row').next('.row').find('table').attr('data-table-data',JSON.stringify(_dummyArray));
	                    }
	                    var _tableData1 = $(this).closest('.row').next('.row').find('table').attr('data-table-data');
	                    var _tempData = (typeof _tableData1 != 'undefined' && _tableData1 != "")?JSON.parse(_tableData1):[];
	                    var tempHtml = '';
	                    $.each(_tempData,function(index,value){
	                    	if (index % 2 === 0) {
	                            tempHtml += '<tr class="even"><td>' + value.managementIPTemplateName + '</td><td>' + value.count + '</td><td>' + value.managementIPTemplateDetails.replace(/\n/g, "<br />") + '</td><td><button class="DelTeleRow" type="button" id="' + index + '">Delete</button></td></tr>'
	                        } else {
	                            tempHtml += '<tr class="odd"><td>' + value.managementIPTemplateName + '</td><td>' + value.count + '</td><td>' + value.managementIPTemplateDetails.replace(/\n/g, "<br />") + '</td><td><button class="DelTeleRow" type="button" id="' + index + '">Delete</button></td></tr>'
	
	                        }
	                    });
	                    $(this).closest('.row').next('.row').find('table > tbody').html(tempHtml);
	                } 
	                $(this).closest('.row').find('.managementIPTemplates').val("");
	                $(this).closest('.row').find('.managementIPTemplates-id').val("");
	                $(this).closest('.row').find('.IP_quatity').val("");
				}
            });
		},
		doTelemetry1 : function(projectTypeObj){
			var _this = this;
			if(this.managementIPTemplates.length == 0){
				this.showLoader1NEquip();
				this.getOrPostXMLHttpRequest({
	                url: contextPath + '/rest/templateservice/getManagementIPTemplate',
	                data: JSON.stringify(projectTypeObj),
	                type: 'POST',
	                timeout: 1000000,
	                dataType: "json",
	                contentType: "application/json",
	                success: function (data) {
	                	_this.managementIPTemplates = data;
	                    var _telemetryRef = $('.telemetryDetails');
	                    $(_telemetryRef).find(".managementIPTemplates").autocomplete({
	            			source : data,
	            	        minLength: 2,
	            	        select: function(event, ui) {
	            	        	$(_telemetryRef).find(".managementIPTemplates").val( ui.item.label );
	            	        	$(_telemetryRef).find(".managementIPTemplates-id").val( ui.item.value );
	            	            return false;
	            	        }
	            	    });
	                    $(_telemetryRef).show();
	                    _this.hideLoader1NEquip();
	                },
	                error: function (data) {
	                	var _telemetryRef = $('.telemetryDetails');
	                	_this.managementIPTemplates = [];
	                    $(_telemetryRef).hide();
	                    _this.hideLoader1NEquip();
	                }
	            });
			} else {
				var _telemetryRef = $('.telemetryDetails');
                $(_telemetryRef).find(".managementIPTemplates").autocomplete({
        			source : this.managementIPTemplates,
        	        minLength: 2,
        	        select: function(event, ui) {
        	        	$(_telemetryRef).find(".managementIPTemplates").val( ui.item.label );
        	        	$(_telemetryRef).find(".managementIPTemplates-id").val( ui.item.value );
        	            return false;
        	        }
        	    });
                $(_telemetryRef).show();
			}
		},
		doTelemetry : function(ref,projectTypeObj){
			var _this = this;
			if(this.managementIPTemplates.length == 0){
				this.showLoader1NEquip();
				this.getOrPostXMLHttpRequest({
	                url: contextPath + '/rest/templateservice/getManagementIPTemplate',
	                data: JSON.stringify(projectTypeObj),
	                type: 'POST',
	                timeout: 1000000,
	                dataType: "json",
	                contentType: "application/json",
	                success: function (data) {
	                	_this.managementIPTemplates = data;
	                    var _telemetryRef = $(ref).closest('.panel-body').find('.telemetryDetails');
	                    $(_telemetryRef).find(".managementIPTemplates").autocomplete({
	            			source : data,
	            	        minLength: 2,
	            	        select: function(event, ui) {
	            	        	$(_telemetryRef).find(".managementIPTemplates").val( ui.item.label );
	            	        	$(_telemetryRef).find(".managementIPTemplates-id").val( ui.item.value );
	            	            return false;
	            	        }
	            	    });
	                    $(_telemetryRef).show();
	                    _this.hideLoader1NEquip();
	                },
	                error: function (data) {
	                	var _telemetryRef = $(ref).closest('.panel-body').find('.telemetryDetails');
	                	_this.managementIPTemplates = [];
	                    $(_telemetryRef).hide();
	                    _this.hideLoader1NEquip();
	                }
	            });
			} else {
				var _telemetryRef = $(ref).closest('.panel-body').find('.telemetryDetails');
                $(_telemetryRef).find(".managementIPTemplates").autocomplete({
        			source : this.managementIPTemplates,
        	        minLength: 2,
        	        select: function(event, ui) {
        	        	$(_telemetryRef).find(".managementIPTemplates").val( ui.item.label );
        	        	$(_telemetryRef).find(".managementIPTemplates-id").val( ui.item.value );
        	            return false;
        	        }
        	    });
                $(_telemetryRef).show();
			}
		},
		populateData : function(){
			var _html = '',_this = this;
			var _isMultiBuild = (typeof this.isMultiBuild != 'undefined' && this.isMultiBuild == true)?true:false;
			this.clliObject = (typeof this.clliObject != 'undefined' && !$.isEmptyObject(this.clliObject))?this.clliObject:aaData;
			this.nfTreeUrl = (typeof _nfTreeUrl != 'undefined')?_nfTreeUrl:'';
			this.userVzId = (typeof userVZId != 'undefined')?userVZId:'';
			this.programNameId = $.trim($('#programName').find('option:selected').val());
			this.programPhaseId = $.trim($('#phase').find('option:selected').val());
			_html += '<option value="">--Please Select--</option>';
			this.clliObject.sort(function(el1,el2){ return _this.compare(el1, el2, "CLLI") });
			$.each(this.clliObject,function(index,value){
				_html+= '<option value="'+value.CLLI+'">'+value.CLLI+'</option>';
			});
			if(_isMultiBuild){
				$('#pscTable').find('.aclli').html(_html);
				$('#pscTable').find('.zclli').html(_html);
			} else {
				$('#dynamicProjectDetailContent').find('.aclli').html(_html);
				$('#dynamicProjectDetailContent').find('.zclli').html(_html);
			}
			$('.mse1NForm').validationEngine('attach', {promptPosition : "bottomLeft", scroll: false});
			$(document).on('click','#form31NMSENext',function(){
				if($('.mse1NForm').validationEngine('validate')){
					if(_this.flagErrorMessage == false){
						_this.saveCircuitProject();
					} else {
						_this.showMessage1NDate('error','Please select valid Circuit Type and Bandwidth.');
					}
				}
			});
			$('.mseLagCircuitId').autocomplete({
				source : function(request,response){
					$.ajax({
						url: contextPath+'/rest/projectInitation/searchCircuit',
						dataType: "json",
						data: {
							term: request.term
						},
						success: function( data ) {
							response(data);
						}
					});
				},
		        minLength: 9,
		        select: function( event, ui ) {
					_stateCode = ui.item.value;
		        }
    	    });
			$(document).on('change','.mseLagGroupId',function(){
				$(this).closest('.col-md-3').next('.col-md-3').find('input[type="text"]').val('');
				if($.trim($(this).val()) != "" && $.trim($(this).val()) == "Y"){
					$(this).closest('.col-md-3').next('.col-md-3').show();
				} else {
					$(this).closest('.col-md-3').next('.col-md-3').hide();
				}
			});
			$(document).on('change','.mseCircuitType,.mseSpeed',function(){
				var _thisSelector = $(this).closest('.row');
				var _circuitType = $(_thisSelector).find('.mseCircuitType').val();
				var _circuitSpeed = $(_thisSelector).find('.mseSpeed').val();
				if($.trim(_circuitType) != '' && $.trim(_circuitSpeed) != ''){
					var _obj = {};
					_obj.circuitType = _circuitType;
					_obj.circuitSpeed = _circuitSpeed;
					_this.getServiceDescriptor(_obj,function(data){
						$(_thisSelector).attr('data-service',JSON.stringify(data));
					});
				}
			});
			var oneNCircuitTypeOptions = $(".mseCircuitType");
			$.ajax({
				type: "GET",
				url:contextPath+"/rest/projectInitation/getCircuitTypes",
				dataType: "json",
				success: function (data) {
					$('.mseCircuitType').find('option').remove().end().append('<option value="" selected="selected">--Please Select--</option>').val('');
					$.each(data, function() {
						oneNCircuitTypeOptions.append($("<option/>").val(this.nfCktTypeName).text(this.nfCktTypeName));
					});
				}
			});
			var oneNBandWidthOptions = $(".mseSpeed");
			$.ajax({
				type: "GET",
				url:contextPath+"/rest/projectInitation/getBandWidth",
				dataType: "json",
				success: function (data) {
					$('.mseSpeed').find('option').remove().end().append('<option value="" selected="selected">--Please Select--</option>').val('');
					$.each(data, function() {
						oneNBandWidthOptions.append($("<option/>").val(this.nfCktBandWidth).text(this.nfCktBandWidth));
					});
				}
			});
		},
		getServiceDescriptor : function(obj,callback){
			var _this = this;
			this.showLoader1NData();
			$('.vzuui-alertMsg_holder-1nData').find('.msg').hide();
			this.getOrPostXMLHttpRequest({
				url : contextPath+'/rest/projectInitation/getServiceDescriptor',
				type:'POST',
				timeout: 1000000,
				dataType: "json",
				contentType : "application/json",
				data:JSON.stringify(obj),
				success : function(data){
					if($.isArray(data.serviceDescriptor)){
						if(data.serviceDescriptor[0].status === "ACTIVE"){
							_this.flagErrorMessage = false;
							callback.call(this,data);
						} else {
							_this.flagErrorMessage = true;
							_this.showMessage1NDate('error','Selected Circuit Type and Bandwidth is not active.');
							callback.call(this,"");
						}
					} else {
						_this.flagErrorMessage = true;
						_this.showMessage1NDate('error','Selected Circuit Type and Bandwidth is not valid.');
						callback.call(this,"");
					}
					_this.hideLoader1NData();
				}
			});
		},
		saveEquipmentProject : function(){
			var _this = this;
			var _finalPayload = [],_bonitaParamsMSEChild = {};
			_bonitaParamsMSEChild.projectName = $.trim($('#projectName').val().replace(/&/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/"/g, ""));
			_bonitaParamsMSEChild.startDate = '2016-11-02';
			_bonitaParamsMSEChild.dueDate = $.trim($('#trafficDate').val());
			_bonitaParamsMSEChild.projectDescription = $.trim($('#projectDesc').val().replace(/&/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/"/g, ""));
			_bonitaParamsMSEChild.networkActivityTypeId = $.trim($('#networkActivity').val());
			_bonitaParamsMSEChild.engineeringDisciplineId = $.trim($('#engDiscipline').val());
			_bonitaParamsMSEChild.projectTypeId = $.trim($('#projectType').val());
			_bonitaParamsMSEChild.serviceTypeId = $.trim($('#serviceType').val());
			_bonitaParamsMSEChild.lob = (typeof aaData != 'undefined' && aaData.length > 0)?(typeof aaData[0].SITECODE != 'undefined' && aaData[0].SITECODE != 'NA')?'B':'T':'C';
			_bonitaParamsMSEChild.clliCode = (typeof aaData != 'undefined' && aaData.length > 0)?(typeof aaData[0].SITECODE != 'undefined' && aaData[0].SITECODE != 'NA')?aaData[0].SITECODE:aaData[0].CLLI:'NA';
			_bonitaParamsMSEChild.payloadInfo = {};
			_bonitaParamsMSEChild.payloadInfo.clli = (typeof aaData != 'undefined' && aaData.length > 0)?(typeof aaData[0].SITECODE != 'undefined' && aaData[0].SITECODE != 'NA')?aaData[0].SITECODE:aaData[0].CLLI:'NA';
			_bonitaParamsMSEChild.payloadInfo.state =  (typeof aaData != 'undefined' && aaData.length > 0)?aaData[0].STATE:'NA';
			_bonitaParamsMSEChild.payloadInfo.buildingCode =  (typeof aaData != 'undefined' && aaData.length > 0)?aaData[0].buildingId:'NA';
			_bonitaParamsMSEChild.payloadInfo.locationCode = (typeof aaData != 'undefined' && aaData.length > 0)?aaData[0].locationCode:'NA';
			_bonitaParamsMSEChild.payloadInfo.faRftDate = $.trim($('#trafficDate').val());
			_bonitaParamsMSEChild.payloadInfo.location =  (typeof aaData != 'undefined' && aaData.length > 0)?(typeof aaData[0].SITECODE != 'undefined' && aaData[0].SITECODE != 'NA')?aaData[0].SITECODE:aaData[0].CLLI:'NA';
			_bonitaParamsMSEChild.payloadInfo.networkActivityType =  $.trim($('#networkActivity').find('option:selected').text());
			_bonitaParamsMSEChild.payloadInfo.engineeringDiscipline =  $.trim($('#engDiscipline').find('option:selected').text());
			_bonitaParamsMSEChild.payloadInfo.projectType =  $.trim($('#projectType').find('option:selected').text());
			_bonitaParamsMSEChild.payloadInfo.serviceType =  $.trim($('#serviceType').find('option:selected').text());
			_bonitaParamsMSEChild.payloadInfo.networkPlanNum = ($('.networkPlanNo').val()!="")?$('.networkPlanNo').val():'';
			var _quesRow = $('.dynamicUserQuestion_1nEquip');
			var _ipDetailsRow = $('.telemetryDetails table').data('tableData');
			_bonitaParamsMSEChild.payloadInfo.managementIPRequest = JSON.stringify(_ipDetailsRow);
			$(_quesRow).find('.ques').each(function(j){
				var _questionKey = $(this).data('questionKey'),_questionId = $(this).data('questionId'),_selectedAnswer = $('#0-questions_'+_questionId).is(':checked'),_answer = (_selectedAnswer)?'Y':'N';
				_bonitaParamsMSEChild.payloadInfo[_questionKey] = _answer;
			});
			
			_bonitaParamsMSEChild.payloadInfo.programManagerId = 'NA'
			_bonitaParamsMSEChild.payloadInfo.createdBy = this.userVzId;
			_bonitaParamsMSEChild.payloadInfo.programNameId = this.programNameId;
			_bonitaParamsMSEChild.payloadInfo.programPhaseId = this.programPhaseId;
			_finalPayload.push(_bonitaParamsMSEChild);
			$('#step3_tab').hide();
			$('#modal-one').show();
			this.getOrPostXMLHttpRequest({
				url : contextPath+'/rest/projectInitation/createNFProject',
				type:'POST',
				timeout: 1000000,
				dataType: "json",
				contentType : "application/json",
				data:JSON.stringify(_finalPayload),
				success : function(data){
					if(data != undefined && typeof data.nfID != "undefined" && data.nfID != "" && data.nfID != "null" && data.nfID != null && data.statusCode == 0){
						var dataObj=data;
						$('#step3_tab').show();
						$('#modal-one').hide();
						var _landingURL = '';
						if(typeof dataObj.nfID != "undefined" && dataObj.nfID != "" && dataObj.nfID != "null" && dataObj.nfID != null){
							_landingURL = _this.nfTreeUrl+'?nfid='+dataObj.nfID+'&uuiFlag=true&defaultView=Project Summary&newView=Y';
						} else {
							_landingURL = contextPath+'/projectInitDetails.jsp?projectId='+data.projectId+'&uuiFlag=true';
						}
						var _html1 = '',_modalTitle = 'Project is created successfully with the following details';
						var _html = '';
						_html = '<div class="modal fade bs-example-modal-lg" id="myModal1" tabindex="-1" data-backdrop="static" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content">'
							+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" onclick="window.location.href = self.location" aria-label="Close"><span aria-hidden="true">x</span></button><h4 class="modal-title" id="myModalLabel1">'+_modalTitle+'</h4></div>'	
							+'<div class="modal-body">'
							+'<div class="row">'
							+'<div class="col-md-12"><div class="label-content" style="display:inline-block;">NFID :</div> <div id="piAltNfId" class="label-data" style="display:inline-block;"><label id="flexiComponent21" elem-type="labelPlain" class="vzuui-flexi-label">'+dataObj.nfID+'</label></div></div>'
							+'</div>'
							+'<div class="clearfix" style="height:15px;"></div><div class="row">'
							+'<div class="col-md-12"><div class="label-content" style="display:inline-block;">Project Name :</div><div class="label-data" style="display:inline-block;"><label id="flexiComponent22" elem-type="labelPlain" class="vzuui-flexi-label">'+_finalPayload[0].projectName+'</label></div></div>'
							+'</div>'
							+'<div class="row"><div class="col-md-3"><a href="'+_landingURL+'" class="btn btn-danger btn-sm">Ok</a></div></div>'
							+'</div>'
							+'</div></div></div>';
						$('body').append(_html);
						_this.hideLoader();
						$('#myModal1').modal('show');
					} else {
						_this.errorPopup(data.txId,'Bonita', 'Project Creation failed');
					}
				},
				error : function(data){
					_this.errorPopup(data.txId, "WFM", data.statusMessage);
				}
			});
		},
		saveCircuitProject : function(){
			var _this = this;
			var _finalPayload = [],_bonitaParamsMSEChild = {};
			_bonitaParamsMSEChild.projectName = $.trim($('#projectName').val().replace(/&/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/"/g, ""));
			_bonitaParamsMSEChild.startDate = '2016-11-02';
			_bonitaParamsMSEChild.dueDate = jQuery.datepicker.formatDate('mm/dd/yy', _nextDate);
			_bonitaParamsMSEChild.projectDescription = $.trim($('#projectDesc').val().replace(/&/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/"/g, ""));
			_bonitaParamsMSEChild.networkActivityTypeId = $.trim($('#networkActivity').val());
			_bonitaParamsMSEChild.engineeringDisciplineId = $.trim($('#engDiscipline').val());
			_bonitaParamsMSEChild.projectTypeId = $.trim($('#projectType').val());
			_bonitaParamsMSEChild.serviceTypeId = $.trim($('#serviceType').val());
			_bonitaParamsMSEChild.lob = 'C';
			_bonitaParamsMSEChild.clliCode = (typeof aaData != 'undefined' && aaData.length > 0)?aaData[0].CLLI:'NA';
			_bonitaParamsMSEChild.payloadInfo = {};
			_bonitaParamsMSEChild.payloadInfo.circuitType = ($('.mseCircuitType').val()!="")?$('.mseCircuitType').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.linkActionType = ($('.mseLinkActionType').val()!="")?$('.mseLinkActionType').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.speed = ($('.mseSpeed').val()!="")?$('.mseSpeed').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.circuitQuantity = ($('.mseCircuitQuantity').val()!="")?$('.mseCircuitQuantity').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.networkPlan = ($('.mseNetworkPlan').val()!="")?$('.mseNetworkPlan').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.linkAugment = ($('.mseLinkAugment').val()!="")?$('.mseLinkAugment').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.aCLLI = ($('.mseACLLI').val()!="")?$('.mseACLLI').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.aTID = ($('.mseATID').val()!="")?$('.mseATID').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.zCLLI1 = ($('.mseZCLLI').val()!="")?$('.mseZCLLI').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.zTID = ($('.mseZTID').val()!="")?$('.mseZTID').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.diversity = ($('.mseDiversity').val()!="")?$('.mseDiversity').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.lagGroupId = ($('.mseLagGroupId').val()!="")?$('.mseLagGroupId').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.lagCktName = ($('.mseLagCircuitId').val()!="")?$('.mseLagCircuitId').val():'';
			_bonitaParamsMSEChild.payloadInfo.networkConnection = ($('.mseNetworkConnection').val()!="")?$('.mseNetworkConnection').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.latency = ($('.mseLatency').val()!="")?$('.mseLatency').val():'NA';
			_bonitaParamsMSEChild.payloadInfo.clli = (typeof aaData != 'undefined' && aaData.length > 0)?aaData[0].CLLI:'NA';
			_bonitaParamsMSEChild.payloadInfo.state =  (typeof aaData != 'undefined' && aaData.length > 0)?aaData[0].STATE:'NA';
			_bonitaParamsMSEChild.payloadInfo.buildingCode =  (typeof aaData != 'undefined' && aaData.length > 0)?aaData[0].buildingId:'NA';
			_bonitaParamsMSEChild.payloadInfo.locationCode = (typeof aaData != 'undefined' && aaData.length > 0)?aaData[0].locationCode:'NA';
			_bonitaParamsMSEChild.payloadInfo.location =  (typeof aaData != 'undefined' && aaData.length > 0)?aaData[0].CLLI:'NA';
			_bonitaParamsMSEChild.payloadInfo.networkActivityType =  $.trim($('#networkActivity').find('option:selected').text());
			_bonitaParamsMSEChild.payloadInfo.engineeringDiscipline =  $.trim($('#engDiscipline').find('option:selected').text());
			_bonitaParamsMSEChild.payloadInfo.projectType =  $.trim($('#projectType').find('option:selected').text());
			_bonitaParamsMSEChild.payloadInfo.serviceType =  $.trim($('#serviceType').find('option:selected').text());
			var _serviceDescriptorData = $('.mseCircuitType').closest('.row').data('service');
			var _serviceDescriptor = _serviceDescriptorData;
			if(typeof _serviceDescriptor != 'undefined' && !$.isEmptyObject(_serviceDescriptor)){
				_bonitaParamsMSEChild.payloadInfo.aSideEquipment = _serviceDescriptor.azSideEquipmentInfo.aSideEquipment;
				_bonitaParamsMSEChild.payloadInfo.zSideEquipment = _serviceDescriptor.azSideEquipmentInfo.zSideEquipment;
				_bonitaParamsMSEChild.payloadInfo.svcDescptName = _serviceDescriptor.serviceDescriptor[0].svcDescptName;
				_bonitaParamsMSEChild.payloadInfo.svcDescptId = _serviceDescriptor.serviceDescriptor[0].svcDescptId;
			}
			_bonitaParamsMSEChild.payloadInfo.programManagerId = 'NA'
			_bonitaParamsMSEChild.payloadInfo.createdBy = this.userVzId;
			_bonitaParamsMSEChild.payloadInfo.programNameId = this.programNameId;
			_bonitaParamsMSEChild.payloadInfo.programPhaseId = this.programPhaseId;
			_finalPayload.push(_bonitaParamsMSEChild);
			$('#step3_tab').hide();
			$('#modal-one').show();
			this.getOrPostXMLHttpRequest({
				url : contextPath+'/rest/projectInitation/createNFProject',
				type:'POST',
				timeout: 1000000,
				dataType: "json",
				contentType : "application/json",
				data:JSON.stringify(_finalPayload),
				xhrFields : {
					tokenName : tokenValue
				},
				success : function(data){
					if(data != undefined && typeof data.nfID != "undefined" && data.nfID != "" && data.nfID != "null" && data.nfID != null && data.statusCode == 0){
						var dataObj=data;
						$('#step3_tab').show();
						$('#modal-one').hide();
						var _landingURL = '';
						if(typeof dataObj.nfID != "undefined" && dataObj.nfID != "" && dataObj.nfID != "null" && dataObj.nfID != null){
							_landingURL = _this.nfTreeUrl+'?nfid='+dataObj.nfID+'&uuiFlag=true&defaultView=Project Summary&newView=Y';
						} else {
							_landingURL = contextPath+'/projectInitDetails.jsp?projectId='+data.projectId+'&uuiFlag=true';
						}
						var _html1 = '',_modalTitle = 'Project is created successfully with the following details';
						var _html = '';
						_html = '<div class="modal fade bs-example-modal-lg" id="myModal1" tabindex="-1" data-backdrop="static" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content">'
							+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" onclick="window.location.href = self.location" aria-label="Close"><span aria-hidden="true">x</span></button><h4 class="modal-title" id="myModalLabel1">'+_modalTitle+'</h4></div>'	
							+'<div class="modal-body">'
							+'<div class="row">'
							+'<div class="col-md-12"><div class="label-content" style="display:inline-block;">NFID :</div> <div id="piAltNfId" class="label-data" style="display:inline-block;"><label id="flexiComponent21" elem-type="labelPlain" class="vzuui-flexi-label">'+dataObj.nfID+'</label></div></div>'
							+'</div>'
							+'<div class="clearfix" style="height:15px;"></div><div class="row">'
							+'<div class="col-md-12"><div class="label-content" style="display:inline-block;">Project Name :</div><div class="label-data" style="display:inline-block;"><label id="flexiComponent22" elem-type="labelPlain" class="vzuui-flexi-label">'+_finalPayload[0].projectName+'</label></div></div>'
							+'</div>'
							+'<div class="row"><div class="col-md-3"><a href="'+_landingURL+'" class="btn btn-danger btn-sm">Ok</a></div></div>'
							+'</div>'
							+'</div></div></div>';
						$('body').append(_html);
						_this.hideLoader();
						$('#myModal1').modal('show');
					} else {
						_this.errorPopup(data.txId,'Bonita', 'Project Creation failed');
					}
				},
				error : function(data){
					_this.errorPopup(data.txId, "WFM", data.statusMessage);
				}
			});
		},
		attachEvents : function(enggData,_networkActivity,_engineeringDiscipline,_projectTypeId,_serviceTypeId){
			var uniqueIds = [],uniqueIds1 = [],uniqueIds2 = [],_this=this;
			$.each(enggData,function(index,value){
				if ($.inArray(value.enggdiscip_id, uniqueIds) === -1) {
					_this.enggDisciplineData.push({"enggdiscip_id":value.enggdiscip_id,"enggdiscip_name":value.enggdiscip_name});
					uniqueIds.push(value.enggdiscip_id);
				}
				if ($.inArray(value.project_type_id, uniqueIds1) === -1) {
					_this.networkType.push({"project_type_id":value.project_type_id,"project_type_name":value.project_type_name});
					uniqueIds1.push(value.project_type_id);
				}
			});
			var _enggData1 = $.grep(this.big4DataList,function(obj){ return obj.network_id == _networkActivity && obj.enggdiscip_id == _engineeringDiscipline && obj.project_type_id == _projectTypeId  });
			$.each(_enggData1,function(index,value){
				if ($.inArray(value.service_type_id, uniqueIds2) === -1 && value.service_type_id != _serviceTypeId && value.service_type_id != '215') {
					_this.projectType.push({"service_type_id":value.service_type_id,"service_type_name":value.service_type_name});
					uniqueIds2.push(value.project_type_id);
				}
			});
			$(document).on('click','#checkallLocationMSE',function(){
				if($(this).is(':checked')){
					$('.locationsSelected').prop('checked',true);
				} else {
					$('.locationsSelected').prop('checked',false);
				}
			});
			$(document).on('change','.mseClliCodes',function(){
				var _currentValue = $(this).val();
				$(this).find('option').removeAttr('selected');
				$(this).val(_currentValue);
				$(this).find('option[value="'+_currentValue+'"]').attr('selected','selected');
			});
			$("#stateMSE").autocomplete({
				source : function(request,response){
					$.ajax({
						url: contextPath+'/rest/projectInitation/searchState',
						dataType: "json",
						data: {
							term: request.term
						},
						success: function( data ) {
							response(data);
						}
					});
				},
		        minLength: 1,
		        select: function( event, ui ) {
					_stateCode = ui.item.value;
		        }
		    });
		    $("#countryMSE").autocomplete({
				source : function(request,response){
					$.ajax({
						url: contextPath+'/rest/projectInitation/searchCountry',
						dataType: "json",
						data: {
							term: request.term
						},
						success: function( data ) {
							response(data);
						}
					});
				},
		        minLength: 1,
		        select: function( event, ui ) {
					_countryCode = ui.item.country;
		        }
		    });
		    $("#cityMSE").autocomplete({
				source : function(request,response){
					var state = "";
					if(typeof _stateCode != "undefined" && $.trim(_stateCode) != ""){
						state = _stateCode;
					} else {
						state = $("#stateCode").val();
					}
					$.ajax({
						url: contextPath+'/rest/projectInitation/searchCity',
						dataType: "json",
						data: {
							term: request.term,
							stateCode : state
						},
						success: function( data ) {
							response(data);
						}
					});
				},
		        minLength: 2,
		        select: function( event, ui ) {
		        }
		    });
		    $(document).on('click','#delLocationMSE',function(){
				if(aaData.length>0){
					var checkedValues = $('input[type="checkbox"][id^="location_"]:checked').map(function() {
						return this.value;
					}).get();
					if(checkedValues.length > 0){
						for (var i = checkedValues.length -1; i >= 0; i--){
							aaData.splice(parseInt(checkedValues[i]),1);
							clliResultsTable.fnDeleteRow(parseInt(checkedValues[i]));
						}
					}
					if($('#checkallLocation').is(':checked')){
						$('#checkallLocation').prop('checked',false);
					}
				}
			});
		    $('#advSearchMSE').on('click',function(){
				var cnt = 0;
				$('#advancedSearchFrm_frm_mse').find('.customField').each(function(){
					if($(this).val()==""){
						cnt = cnt+1;
					}
				});
				if(cnt==$('#advancedSearchFrm_frm_mse').find('.customField').length || ($.trim($('#clliMSE').val()) != '' && $.trim($('#clliMSE').val()).length < 4) || ($.trim($('#sitecodeMSE').val()) != '' && $.trim($('#sitecodeMSE').val()).length < 4)){
					$('.vzuui-alertMsg_holder_MSE1').find('.alert-danger').show();
					$('.vzuui-alertMsg_holder_MSE1').find('.alert-danger p').text("Please enter atleast a field to proceed with Advanced Search/ Enter atleast 4 characters for Loc CLLI/vSAP Sitecode to perform wildcard search");
				} else {
					if($('.vzuui-alertMsg_holder_MSE1').find('.alert-danger').is(':visible')){
						$('.vzuui-alertMsg_holder_MSE1').find('.alert-danger p').text('');
						$('.vzuui-alertMsg_holder_MSE1').find('.alert-danger').hide();
					}
					_this.doAdvancedSearch();
				}
			});
			$('#advSearchClear').on('click',function(){
				$('#advancedSearchFrm_frm').find('.customField').val('');
			});
			$('#advSearchCancel').on('click',function(){
				_this.enableBasicSearch();
				$( "#advancedSearchFrm_frm" ).dialog("close");
			});
			$(document).on('click','#pscTable > tbody tr.mainRowPSCInput td',function(){
				$('.strip').hide();
				if($(this).closest('tr').find('.strip').length > 0){
					$(this).closest('tr').find('.strip').show();
				}
			});
			$(document).on('click','.strip ul li a',function(){
				var _rowNumber = $(this).closest('tr').data('rowNumber');
				$('#defaultedRow-'+_rowNumber).remove();
				$('#subRow-'+_rowNumber).remove();
			});
			$(document).on('click','#addRowsPSC',function(){
				if(typeof _this.clliQuestionsTablePSC === 'object'){
					var _length = $('#pscTable > tbody').find('tr').length;
					if(_length < 25){
						var _html = _this.createPSCRowAdd();
						$('#pscTable > tbody').append(_html);
						$('#pscTable > tbody tr').each(function(i){
							var _rowNumber = $(this).data('rowNumber');
							$('#subProjectType-'+_rowNumber).multiselect('rebuild');
						});
						$('#pscTable > tbody tr#defaultedRow-'+lastRow+' .accordion-psc').trigger('click');
						var _daysList = [];
						$.each(_this.holidayList,function(index,val){
							_daysList.push(val.HOLIDAY_DATE);
						});
						$(".msetrafficDateVZT").datepicker({
							buttonImage: contextPath+'/includes/css/images/calendar.png',
						  	buttonImageOnly: true,
						  	changeMonth: true,
						  	changeYear: true,
						  	showOn: 'both',
						  	minDate : 0,
						  	beforeShowDay: function(date) {
						  		var datestring = jQuery.datepicker.formatDate('yy-mm-dd', date);
								var day = date.getDay();
								return [ _daysList.indexOf(datestring) == -1 && day != 0 && day != 6];
						  	},
						  	onSelect :function(dateText,inst){
						  		if(typeof dateText != 'undefined' && dateText != ''){
						  			$(this).blur();
						  		}
						  	}
						});
					} else {
						_this.showMessage('error','Maximum Limit of 25 Reached.');
						$(window).scrollTop(0);
					}
				}
			});
			$(document).on('click','#form3MSEBack',function(){
				$('.vzuui-alertMsg_holder-mse').find('.msg').hide();
				var pageNo = $(this).data('form');
				$("#navigationID").removeAttr("class");
				$("#navigationID").addClass("active"+pageNo);
				$('.vzuui-navigator-timeline').find('.vzuui-todo_holder_content').hide();
				$('.vzuui-navigator-timeline').find('.vzuui-todo_holder_content').eq((pageNo-1)).show();
			});
			$(document).on('click','#saveMSELocations',function(){
				_this.showLoader();
				_this.addLocationsInDropDown();
			});
			$(document).on('keyup keydown','.ownerName',function(e){
				var _rowNumber = $(this).closest('tr').data('rowNumber'),_mainRow = $('#pscTable > tbody tr#defaultedRow-'+_rowNumber);
				if(e.keyCode != 8 && e.keyCode != 9 && e.keyCode != 18 && e.keyCode != 32 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 46) {
					var value =  $('#ownerName-'+_rowNumber).val();
					if(value.length > 2) {
						$('#ownerName-'+_rowNumber).autocomplete({
							source : function(request,response){
								$.ajax({
									url: contextPath+'/rest/projectInitation/getProjectOwnerDetails',
									dataType: "json",
									data: {
										name: value
									},
									success: function( data ) {
										response(data);
									}
								});
							},
					        minLength: 2,
					        select: function( event, ui ) {
					        	$('#ownerName-'+_rowNumber).attr("data-owner-id",ui.item.id);
					        	projectOwnerId = ui.item.id;
					        }
					    });
					}
				}
			});
			$(document).on('change','.location',function(){
				var _rowNumber = $(this).closest('tr').data('rowNumber'),_mainRow = $('#pscTable > tbody tr#defaultedRow-'+_rowNumber);	
				var updateAttr;
				currentClli=$("#pscClliCodes-"+_rowNumber).find('option:selected').text();
				$("#projectName-"+_rowNumber).text(_this.clliPrjName[currentClli]);
				$('#projectName-'+_rowNumber).attr("oldprjname",_this.clliPrjName[currentClli]);
				
					$('#pscTable > tbody tr#defaultedRow-'+_rowNumber).each(function(i){
						var _quesRow = $(this).next('tr.detailsRowPsc');
						$(_quesRow).find('.ques').each(function(j){
							$(this).removeAttr("data-clli-attr");
							$(this).attr("data-clli-attr",$.trim($('#pscClliCodes-'+_rowNumber).val()));
							if($.trim($(this).attr("data-label-name").replace(/\s+/g, '').toUpperCase()) == 'TELEMETRYREQUIRED' || $.trim($(this).attr("data-label-name").replace(/\s+/g, '').toUpperCase()) == 'CRITICALPATH'){
								$(this).removeClass("vzuui-onOff_toggle_mse on defaultVal ques").addClass("vzuui-onOff_toggle_mse on ques");
							} else {
								$(this).removeClass("vzuui-onOff_toggle_mse on defaultVal ques").addClass("vzuui-onOff_toggle_mse on ques enableSubProjectType");
							}
							if($('div[data-label-name="'+$(this).attr("data-label-name")+'"][data-clli-attr="'+$.trim($('#pscClliCodes-'+_rowNumber).val())+'"]:not(.on)').length > 0){
								$('div.on[data-label-name="'+$(this).attr("data-label-name")+'"][data-clli-attr="'+$.trim($('#pscClliCodes-'+_rowNumber).val())+'"]').each(function(){
									$(this).attr("class","vzuui-onOff_toggle_mse on defaultVal ques");
								});
							}
						});
					});
				
				
			});
			$(document).on('click','.vzuui-onOff_toggle_mse:not(.defaultVal),.vzuui-onOff_toggle_off_mse:not(.defaultVal)',function(event,flag){
				event.stopImmediatePropagation();
				var _rowNumber = $(this).closest('tr').data('rowNumber'),_mainRow = $('#pscTable > tbody tr#defaultedRow-'+_rowNumber);
				var _projectTypeObj = {};
				_projectTypeObj.networkActivityTypeId = _networkActivity;
				_projectTypeObj.engineeringDisciplineId = $(_mainRow).find('.mseEnggDiscip').val();
				_projectTypeObj.projectTypeId = $(_mainRow).find('.mseNetworkType').val();
				var currentLabel=$(this).attr("data-label-name");
				if(!$(this).hasClass('vzuui-onOff_toggle_mse on'))  {
					$(this).next().prop('checked',false);
					$(this).removeClass("vzuui-onOff_toggle_off_mse").addClass("vzuui-onOff_toggle_mse on");
				} else {
					$(this).next().prop('checked',true);
					$(this).removeClass("vzuui-onOff_toggle_mse on").addClass("vzuui-onOff_toggle_off_mse");
					$('#pscTable > tbody tr#defaultedRow-'+_rowNumber).each(function(i){
						var _quesRow = $(this).next('tr.detailsRowPsc');
						$(_quesRow).find('.ques').each(function(j){
							$(this).attr("data-clli-attr",$.trim($('#pscClliCodes-'+_rowNumber).val()));
						});
					});
					if($('div[data-label-name="'+currentLabel+'"][data-clli-attr="'+$.trim($('#pscClliCodes-'+_rowNumber).val())+'"]:not(.on)').length > 0){
						$('div.on[data-label-name="'+currentLabel+'"][data-clli-attr="'+$.trim($('#pscClliCodes-'+_rowNumber).val())+'"]').each(function(){
							$(this).attr("class","vzuui-onOff_toggle_mse on defaultVal ques");
						});	
					}
				}
				_this.toggleEventHandler(this,_projectTypeObj,$(this).data('questionId'),true,function(){
				});
			});
			$(document).on('click','.accordion-psc',function(event){
				event.stopImmediatePropagation();
				if($(this).hasClass('on')){
					$(this).removeClass('on');
					$(this).closest('tr').next('tr.detailsRowPsc').hide();
				} else {
					$(this).addClass('on');
					$(this).closest('tr').next('tr.detailsRowPsc').show();
					if($(this).closest('tr').next('tr.detailsRowPsc').find('td').is(':empty')){
							var _projectTypeObj = {};
							_projectTypeObj.networkActivityTypeId = _networkActivity;
							_projectTypeObj.engineeringDisciplineId = _engineeringDiscipline;
							_projectTypeObj.projectTypeId = _projectTypeId;
							_projectTypeObj.serviceTypeId = _serviceTypeId;
							var _rowObj = $(this).closest('tr').next('tr.detailsRowPsc'),_mainRow = $(this).closest('tr');
							_this.showLoader();
							_this.getOrPostXMLHttpRequest({
								url : contextPath+'/rest/projectInitation/getMSEUserQuestions',
								data: JSON.stringify(_projectTypeObj),
								type:'POST',
								timeout: 1000000,
								dataType: "json",
								contentType : "application/json",
								success : function(data){
									if(!$.isEmptyObject(data.userQuestions)){
										var _rowNumber = $(_rowObj).data('rowNumber');
										$(_rowObj).find('td').html(_this.fnFormatDetails(_mainRow,_rowNumber,data));
										$('[data-toggle="popover"]').popover();
										$(_rowObj).find('td div.ques').each(function(){
											if($(this).hasClass('quesAssoc')){
												_this.toggleEventHandler(this,_projectTypeObj,$(this).data('questionId'),false);
											}
										});
									}
									_this.hideLoader();
								},
								error : function(data){
									_this.showMessage('error','Error Processing your Request. Please try after some time.');
									$(window).scrollTop(0);
									_this.hideLoader();
								}
							});
					}
				}
			});
			$(document).on('change','#what, #why, #whyNow, #whyThisWay, #addProjDtls',function(e){
				_this.getProjDesc();
			});
			$(document).on('keyup keydown','#what, #why, #whyNow, #whyThisWay, #addProjDtls',function(e){
				var _count=8000,_leftChars = 0;
				var newLines = $('#pscProjectDesc').val().match(/(\r\n|\n|\r)/g);
				var addition = 0;
				var iKey = e.keycode || e.which || 0;
				if($.trim($(this).val()).length>0){
					_leftChars = _count-parseInt($('#pscProjectDesc').val().length);
					if (newLines != null) {
					}
					$('#pscDescMaxChar').show();
					$('#pscDescMaxChar').text(_leftChars+" Char left");
				} else {
					$('#pscDescMaxChar').hide();
				}
			});
			$(document).on('click','#form3MSENext',function(){
				if($('#mseProjectFrm').validationEngine('validate')){
					_this.savePSCProject(false);
				}
			});
			$(document).on('click','#form3MSESave',function(){
				if($('#mseProjectFrm').validationEngine('validate')){
					_this.savePSCProject(true);
				}
			});
		},
		addLocationsInDropDown : function(){
			var _this = this;
			$('#pscTable').find('.mseClliCodes').each(function(i){
				var _selectedIndex = $(this).prop('selectedIndex'),_value = $(this).val(),_html = '';
				if(_value == ""){
					_html += '<option value="" selected="selected">CLLI1/Site Code</option>';
				} else {
					_html += '<option value="">CLLI1/Site Code</option>';
				}
				_this.aaData.sort(function(el1,el2){ return _this.compare(el1, el2, "CLLI") });
				$.each(_this.aaData,function(index,value){
					if(value.CLLI == _value){
						_html += '<option value="'+value.CLLI+'" selected="selected">'+value.CLLI+'</option>';
					} else {
						_html += '<option value="'+value.CLLI+'">'+value.CLLI+'</option>';
					}
				});
				$(this).html(_html);
			});
			_this.showMessage('success','Locations Added Successfully');
			setTimeout(function(){ $('.vzuui-alertMsg_holder-mse').slideUp(); },2000);
			$('#home-tab').find('a').trigger('click');
			$(window).scrollTop(0);
			_this.hideLoader();
		},
		savePSCProject : function(isDraft){	
			var projectOwner = userVZId;
			var _finalArray = [];
			this.showLoader();
			var _bonitaParamsMSEParent = {};
			var _this = this;
			_bonitaParamsMSEParent.projectName = this.projectName;
			_bonitaParamsMSEParent.projectNameForPopup=this.projectNameForPopup;
			_bonitaParamsMSEParent.startDate = '2016-11-02';
			_bonitaParamsMSEParent.dueDate = $('#plConstDate-0').val();
			_bonitaParamsMSEParent.projectDescription = this.pscProjectDesc;
			_bonitaParamsMSEParent.networkActivityTypeId = $.trim($('#networkActivity').val());
			_bonitaParamsMSEParent.engineeringDisciplineId = $.trim($('#engDiscipline').val());
			_bonitaParamsMSEParent.projectTypeId = $.trim($('#projectType').val());
			_bonitaParamsMSEParent.serviceTypeId = $.trim($('#serviceType').val());
			_bonitaParamsMSEParent.lob = 'C';
			_bonitaParamsMSEParent.createCase = false;
			_bonitaParamsMSEParent.clliCode = 'NA';
			_bonitaParamsMSEParent.isMultiBuild = 'Y';
			_bonitaParamsMSEParent.isDraft = 'N';
			_bonitaParamsMSEParent.systemName = this.systemDetails.NF_SYSTEM_NAME;
			_bonitaParamsMSEParent.componentName = this.systemDetails.NF_COMPONENT_NAME;
			_bonitaParamsMSEParent.componentValue =$('#pscDesc').val().replace(/\,\s/g, ",").replace(/'/g,"");
			_bonitaParamsMSEParent.payloadInfo = {};
			_bonitaParamsMSEParent.payloadInfo.createdBy = userVZId;			
			_bonitaParamsMSEParent.payloadInfo.programNameId = '';
			_bonitaParamsMSEParent.payloadInfo.programPhaseId = '';
			_finalArray.push(_bonitaParamsMSEParent);
			$('#pscTable > tbody tr.mainRowPSCInput:not(.detailsRowPsc),#pscTable > tbody tr.mainRowAssoc:not(.detailsRowPsc)').each(function(i){
				var _bonitaParamsMSEChild = {};
				var _rowNumber = $(this).data('rowNumber');
					_bonitaParamsMSEChild.projectName = $.trim($('#projectName-'+_rowNumber).text());
					_bonitaParamsMSEChild.startDate = '2016-11-02';
					_bonitaParamsMSEChild.dueDate = $('#plConstDate-'+_rowNumber).val();
					_bonitaParamsMSEChild.projectDescription = $.trim($('#pscProjectDesc').val().replace(/\,\s/g, ",").replace(/'/g,""));
					_bonitaParamsMSEChild.networkActivityTypeId =  $.trim($('#networkActivity').val());
					_bonitaParamsMSEChild.engineeringDisciplineId = $.trim($('#engDiscipline').val());
					_bonitaParamsMSEChild.projectTypeId = $.trim($('#projectType').val());
					_bonitaParamsMSEChild.serviceTypeId = $.trim($('#serviceType').val());
					_bonitaParamsMSEChild.lob =  (aaData[0].is_VZT_VZB == 'VZT')?'T':(aaData[0].is_VZT_VZB == 'VZB')?'B':'C';
					_bonitaParamsMSEChild.clliCode = $.trim($('#pscClliCodes-'+_rowNumber).val());
					_bonitaParamsMSEChild.isVersionReq = true;
					_bonitaParamsMSEChild.payloadInfo = {};					
					_bonitaParamsMSEChild.payloadInfo.state =  aaData[0].STATE;
					_bonitaParamsMSEChild.payloadInfo.engineeringDiscipline = $.trim($('#engDiscipline').find('option:selected').text());
					_bonitaParamsMSEChild.payloadInfo.networkActivityType =  $.trim($('#networkActivity').find('option:selected').text());
					_bonitaParamsMSEChild.payloadInfo.projectType = $.trim($('#projectType').find('option:selected').text());
					_bonitaParamsMSEChild.payloadInfo.serviceType = $.trim($('#serviceType').find('option:selected').text());
					_bonitaParamsMSEChild.payloadInfo.createdBy = userVZId;
					_bonitaParamsMSEChild.payloadInfo.what = $.trim($('#what').val().replace(/\,\s/g, ",").replace(/'/g,""));
					_bonitaParamsMSEChild.payloadInfo.why = $.trim($('#why').val().replace(/\,\s/g, ",").replace(/'/g,""));
					_bonitaParamsMSEChild.payloadInfo.whyNow = $.trim($('#whyNow').find('option:selected').text().replace(/\,\s/g, ",").replace(/'/g,""));
					_bonitaParamsMSEChild.payloadInfo.whyThisWay=$.trim($('#whyThisWay').find('option:selected').text().replace(/\,\s/g, ",").replace(/'/g,""));
					_bonitaParamsMSEChild.payloadInfo.additionalProjectDetails=$.trim($('#addProjDtls').val().replace(/\,\s/g, ",").replace(/'/g,""));
					//_bonitaParamsMSEChild.payloadInfo.subProjectType=$.trim($('#subProjectType-'+_rowNumber).find('option:selected').text.replace(/, /g,','));					
					var selected = [];
					$.each($("#subProjectType-"+_rowNumber).find('option:selected'),
							function(index,obj){selected.push($(obj).text());
					});										
			        var subProjectOptions = selected.join(" | ");		        
			        _bonitaParamsMSEChild.payloadInfo.subProjectType=subProjectOptions;
					_bonitaParamsMSEChild.payloadInfo.budgetRegion=$.trim($('#budgetRegion-'+_rowNumber).find('option:selected').text());
					_bonitaParamsMSEChild.payloadInfo.createdBy = userVZId;
					_bonitaParamsMSEChild.payloadInfo.owner=$('#ownerName-'+_rowNumber).data("ownerId");
					_bonitaParamsMSEChild.payloadInfo.additionalProjectDetails=$.trim($('#addProjDtls').val().replace(/\,\s/g, ",").replace(/'/g,""));
					var _quesRow = $(this).next('tr.detailsRowPsc');
					$(_quesRow).find('.ques').each(function(j){
						var _questionKey = $(this).data('questionKey'),_questionId = $(this).data('questionId'),_selectedAnswer = $('#'+_rowNumber+'-questions_'+_questionId).is(':checked'),_answer = (_selectedAnswer)?'Y':'N';
						_bonitaParamsMSEChild.payloadInfo[_questionKey] = _answer;
					});
				_finalArray.push(_bonitaParamsMSEChild);
			});
			this.getOrPostXMLHttpRequest({
				url : contextPath+'/rest/projectInitation/createNFProject',
				type:'POST',
				timeout: 1000000,
				dataType: "json",
				contentType : "application/json",
				data:JSON.stringify(_finalArray),
				success : function(data){
					if(data != undefined && typeof data.nfID != "undefined" && data.nfID != "" && data.nfID != "null" && data.nfID != null && data.statusCode == 0){
						var dataObj=data;
						var _landingURL = '';
						if(typeof dataObj.nfID != "undefined" && dataObj.nfID != "" && dataObj.nfID != "null" && dataObj.nfID != null){
							_landingURL = _this.nfTreeUrl+'?nfid='+dataObj.nfID+'&uuiFlag=true&defaultView=Project Summary&newView=Y';
						} else {
							_landingURL = contextPath+'/projectInitDetails.jsp?projectId='+data.projectId+'&uuiFlag=true';
						}
						var _html1 = '',_modalTitle = 'Project is created successfully with the following details';
						if(isDraft){
							_html1 = '</div><div class="clearfix" style="height:15px;"></div><div class="row">'
								+'<div class="col-md-12"><div class="label-content" style="display:inline-block;">Status :</div><div class="label-data" style="display:inline-block;"><label id="flexiComponent22" elem-type="labelPlain" class="vzuui-flexi-label">Draft</label></div></div></div>';
							_modalTitle = 'Project is saved as Draft with the following details';
						}
						var _html = '';
						_html = '<div class="modal fade bs-example-modal-lg" id="myModal1" tabindex="-1" data-backdrop="static" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content">'
							+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" onclick="window.location.href = self.location" aria-label="Close"><span aria-hidden="true">x</span></button><h4 class="modal-title" id="myModalLabel1">'+_modalTitle+'</h4></div>'	
							+'<div class="modal-body">'
							+'<div class="row">'
							+'<div class="col-md-12"><div class="label-content" style="display:inline-block;">NFID :</div> <div id="piAltNfId" class="label-data" style="display:inline-block;"><label id="flexiComponent21" elem-type="labelPlain" class="vzuui-flexi-label">'+dataObj.nfID+'</label></div></div>'
							+'</div>'
							+'<div class="clearfix" style="height:15px;"></div><div class="row">'
							+'<div class="col-md-12"><div class="label-content" style="display:inline-block;">Project Name :</div><div class="label-data" style="display:inline-block;"><label id="flexiComponent22" elem-type="labelPlain" class="vzuui-flexi-label">'+_finalArray[0].projectNameForPopup+'</label></div></div>'
							+'</div>'
							+'<div class="row"><div class="col-md-3"><a href="'+_landingURL+'" class="btn btn-danger btn-sm">Ok</a></div></div>'
							+'</div>'
							+'</div></div></div>';
						$('body').append(_html);
						_this.hideLoader();
						$('#myModal1').modal('show');
					} else {
						_this.errorPopup(data.txId,'Bonita', 'Project Creation failed');
					}
				},
				error : function(data){
					_this.errorPopup(data.txId, "WFM", data.statusMessage);
				}
			});
		},
		errorPopup : function(txId, system, errorMsg){
			var _html = '';
			_html = '<div class="modal fade bs-example-modal-lg" id="myModalError" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">'
				+'<div class="modal-dialog" role="document">'
				+'<div class="modal-content">'
				+'<div class="modal-header">'
				+'<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="window.location.href = self.location"><span aria-hidden="true">x</span></button>'
				+'<h4 class="modal-title" id="myModalLabel1">Error</h4>'
				+'</div>'
				+'<div class="modal-body">'
				+'<div class="row">'
				+'<div class="col-md-12">Unable to complete your request due to failure in '+system+' Service. Operations team has been notified <b>WFM-PI-ONSHORE@one.verizon.com;WFM-PI-OFFSHORE@one.verizon.com</b> for assistance; Please use the failure Reference id: <b>'+txId+'</b> for future communication.</div>'
				+'</div>'
				+'</div>'
				+'</div>'
				+'</div>'
				+'</div>';
			$('body').append(_html);
			$( "#myModalError" ).modal('show');
		},
		showMessage : function(type,message){
			$('.vzuui-alertMsg_holder-mse').find('.msg').hide();
			switch(type){
				case "success":
					$('.vzuui-alertMsg_holder-mse').find('.alert-success').show();
					if(typeof message != "undefined"){
						$('.vzuui-alertMsg_holder-mse').find('.alert-success p').text(message);
					}
					break;
				case "error":
					$('.vzuui-alertMsg_holder-mse').find('.alert-danger').show();
					if(typeof message != "undefined"){
						$('.vzuui-alertMsg_holder-mse').find('.alert-danger p').text(message);
					}
					break;
				case "warning":
					$('.vzuui-alertMsg_holder-mse').find('.alert-warning').show();
					if(typeof message != "undefined"){
						$('.vzuui-alertMsg_holder-mse').find('.alert-warning p').text(message);
					}
					break;
				case "info":
					$('.vzuui-alertMsg_holder-mse').find('.alert-info').show();
					if(typeof message != "undefined"){
						$('.vzuui-alertMsg_holder-mse').find('.alert-info p').text(message);
					}
					break;
				default :
			}
		},
		showMessage1NDate : function(type,message){
			$('.vzuui-alertMsg_holder-1nData').find('.msg').hide();
			switch(type){
				case "success":
					$('.vzuui-alertMsg_holder-1nData').find('.alert-success').show();
					if(typeof message != "undefined"){
						$('.vzuui-alertMsg_holder-1nData').find('.alert-success p').text(message);
					}
					break;
				case "error":
					$('.vzuui-alertMsg_holder-1nData').find('.alert-danger').show();
					if(typeof message != "undefined"){
						$('.vzuui-alertMsg_holder-1nData').find('.alert-danger p').text(message);
					}
					break;
				case "warning":
					$('.vzuui-alertMsg_holder-1nData').find('.alert-warning').show();
					if(typeof message != "undefined"){
						$('.vzuui-alertMsg_holder-1nData').find('.alert-warning p').text(message);
					}
					break;
				case "info":
					$('.vzuui-alertMsg_holder-1nData').find('.alert-info').show();
					if(typeof message != "undefined"){
						$('.vzuui-alertMsg_holder-1nData').find('.alert-info p').text(message);
					}
					break;
				default :
			}
		},
		toggleEventHandler : function(eventObject,projTypeObj,questionId,isServiceRequired,callback){
			var _this = this;
			this.showLoader();
			_this.hideLoader();
			var _questionId = $(eventObject).data('questionId');
			var _defaultChoice = ($(eventObject).hasClass('vzuui-onOff_toggle_mse'))?'N':'Y';
			var _originalTr = $(eventObject).closest('tr').prev();
			var _serviceId = $(_originalTr).find('.mseServiceType').val(),
			_clliValue = $(_originalTr).find('.mseClliCodes').val(),_idisplayIndex = $(_originalTr).data('rowNumber'),_mainIdisplayIndex = _idisplayIndex;
			var _projectTypeObj = {};
			_projectTypeObj.networkActivityTypeId = projTypeObj.networkActivityTypeId;
			_projectTypeObj.engineeringDisciplineId = $(_originalTr).find('.mseEnggDiscip').val();
			_projectTypeObj.projectTypeId = $(_originalTr).find('.mseNetworkType').val();
			_projectTypeObj.serviceTypeId = _serviceId;
			_projectTypeObj.questionSelectionId = _questionId;
			_projectTypeObj.defaultChoice = _defaultChoice;
			var dcPower=null,hvac=null,generator=null,acService=null,others=null;
			var projectTypeArary=[];
			var projectTypeNameArray=[];
			var filterSubProjectTypes=[];
			$(eventObject).closest('tr').find('.enableSubProjectType.vzuui-onOff_toggle_off_mse').each(function(index){
				projectTypeArary.push($.trim($(this).data("labelName").replace(/\s+/g, '').toUpperCase()));
				projectTypeNameArray.push($(this).data("labelName"));
			});
			filterSubProjectTypes=$.grep(allSubprojects,function(val){
				return $.inArray(val.questionType,projectTypeArary) !== -1; 
			})
			var _subProjType = [],_subProjTypeHTML='';
			if(filterSubProjectTypes.length > 0){
				$.each(filterSubProjectTypes,function(index,value){
					if ($.inArray(value.subProjTypeId, value.subProjTypeName) == -1) {
						_subProjType.push({"subProjTypeId":value.subProjTypeId, "subProjTypeName":value.subProjTypeName});
					}
				});
				_subProjType.sort(function(el1,el2){ return compare(el1,el2, "subProjTypeName") });
				$.each(_subProjType,function(index,value){
					_subProjTypeHTML += '<option value='+value['subProjTypeId']+'>'+value['subProjTypeName']+'</option>';
				});
				$("#subProjectType-"+_idisplayIndex).html(_subProjTypeHTML);
				$("#subProjectType-"+_idisplayIndex).multiselect('rebuild');				
			  } 
			else{
				$.each(allSubprojects,function(index,value){
					if ($.inArray(value.subProjTypeId, value.subProjTypeName) == -1) {
						_subProjType.push({"subProjTypeId":value.subProjTypeId, "subProjTypeName":value.subProjTypeName});
					}
				});
				_subProjType.sort(function(el1,el2){ return compare(el1,el2, "subProjTypeName") });
				$.each(_subProjType,function(index,value){
					_subProjTypeHTML += '<option value='+value['subProjTypeId']+'>'+value['subProjTypeName']+'</option>';
				});
				$("#subProjectType-"+_idisplayIndex).html(_subProjTypeHTML);
				$("#subProjectType-"+_idisplayIndex).multiselect('rebuild');
			}
			var prjNameList=projectTypeNameArray.length > 0 ? $("#projectName-"+_idisplayIndex).attr('oldprjname')+'-'+projectTypeNameArray.join("-") : $("#projectName-"+_idisplayIndex).attr('oldprjname');
			$("#projectName-"+_idisplayIndex).text(prjNameList);
			_this.getProjDesc();
		},
		deleteRow : function(engId,projId,servId,questionId,needMainRow,mainRowNumber,clearQuestionSection){
			if(typeof needMainRow == 'undefined' || needMainRow == false){
				if(typeof clearQuestionSection != 'undefined'){
					$('#pscTable > tbody tr[id^="defaultedRow-assoc-'+mainRowNumber+'"]').remove();
					$('#pscTable > tbody tr[id^="subRow-assoc-'+mainRowNumber+'"]').remove();
					$('#pscTable > tbody tr#subRow-'+mainRowNumber+' td').empty();
					$('#pscTable > tbody tr#subRow-'+mainRowNumber).hide();
					if($('#pscTable > tbody tr#defaultedRow-'+mainRowNumber+' .accordion-psc').hasClass('on')){
						$('#pscTable > tbody tr#defaultedRow-'+mainRowNumber+' .accordion-psc').removeClass('on');	
					}
				} else {
					if(typeof engId != 'undefined'){
						var _uniqueIdForRow = (typeof questionId != 'undefined' && questionId != "")?engId+'-'+projId+'-'+servId+'-'+questionId:engId+'-'+projId+'-'+servId;
						$('#pscTable > tbody .'+_uniqueIdForRow).remove();
					} else {
						$('#pscTable > tbody tr[id^="defaultedRow-assoc-'+mainRowNumber+'"]').remove();
						$('#pscTable > tbody tr[id^="subRow-assoc-'+mainRowNumber+'"]').remove();
					}
				}
			} else {
				$('#pscTable > tbody tr.subRows').remove();
				$('#pscTable > tbody tr[class$="MainQuesSec"]').hide();
			}
			$('#mseProjectFrm').validationEngine('attach', {promptPosition : "bottomLeft", scroll: false});
		},
		createPSCRow : function(serviceId,displayIndex,enggDisciplineId,networkTypeId,parentServiceId,questionId,_mainIdisplayIndex){
			var _this=this,_html1 =  "",_html2 = '',_html3 = '',_html5 = '<option value=""></option>';
			var enggData = $.grep(this.big4DataList,function(obj){ return obj.network_id == _this.parentNetworkActivity && obj.enggdiscip_id == enggDisciplineId && obj.project_type_id == networkTypeId && obj.service_type_id == serviceId   });
			this.clliObject.sort(function(el1,el2){ return _this.compare(el1, el2, "CLLI") });
			$.each(this.clliObject,function(i,v){
				_html5 += '<option value="'+v.CLLI+'">'+v.CLLI+'</option>';
			});
			var cilli=_this.clliObject[0].CLLI,state=_this.clliObject[0].STATE,wireCenter=_this.clliObject[0].LOCATIONNAME,projectType=$.trim($('#serviceType').find('option:selected').text()),_combOfprojectName,__value;
			_combOfprojectName='PWR-'+state+'-'+cilli+'-'+wireCenter+'-'+projectType;
			
			$.each(enggData,function(i,v){
				if(v.enggdiscip_id == enggDisciplineId){
					_html1 += '<option value="'+v.enggdiscip_id+'" selected="selected">'+v.enggdiscip_name+'</option>';
				} 
			});
			$.each(enggData,function(i,v){
				if(v.project_type_id == networkTypeId){
					_html2 += '<option value="'+v.project_type_id+'" selected="selected">'+v.project_type_name+'</option>';
				} 
			});
			$.each(enggData,function(i,v){
				if(v.service_type_id == serviceId){
					_html3 += '<option value="'+v.service_type_id+'" selected="selected">'+v.service_type_name+'</option>';
				} 
			});
			var _html4 = '',_rowIndex = _mainIdisplayIndex+'-'+displayIndex,_rowIndexNumber = _mainIdisplayIndex+''+displayIndex;
			_html4 += '<option value="">--Please Select--</option>';
			_html4 += '<option value="NA" selected="selected">Not Applicable</option>';
			_html4 += '<option value="PM">Program Manager</option>';
			var _html10 = '',_uniqueIdForRow = enggDisciplineId+'-'+networkTypeId+'-'+parentServiceId+'-'+questionId+' subRows',_uniqueId = enggDisciplineId+'-'+networkTypeId+'-'+parentServiceId;
			_html10 += '<tr class="'+_uniqueIdForRow+' '+_uniqueId+' mainRowAssoc" data-display-index="'+displayIndex+'" data-row-number="'+_mainIdisplayIndex+''+displayIndex+'" id="defaultedRow-assoc-'+_mainIdisplayIndex+''+displayIndex+'">';
			_html10 += '<td><a class="accordion-psc" id="accordion-psc-'+_rowIndexNumber+'" data-row-index="'+_rowIndexNumber+'" data-handler="off" href="javascript:void(0);"></a></td>';
			_html10 += '<td><select name="mseClliCodes" id="mseClliCodes-'+_rowIndexNumber+'" class="form-control validate[required]  mseClliCodes">'+_html5+'</select></a></td>';
			_html10 += '<td><select name="mseEnggDiscip" id="mseEnggDiscip-'+_rowIndexNumber+'" class="form-control validate[required]  mseEnggDiscip">'+_html1+'</select></a></td>';
			_html10 += '<td><select name="mseNetworkType" id="mseNetworkType-'+_rowIndexNumber+'" class="form-control mseNetworkType validate[required]">'+_html2+'</select></a></td>';
			_html10 += '<td><select name="mseServiceType" id="mseServiceType-'+_rowIndexNumber+'" class="form-control mseServiceType validate[required]">'+_html3+'</select></a></td>';
			_html10 += '<td><select name="mseassignPMVZB" id="mseassignPMVZB-'+_rowIndexNumber+'" class="form-control mseassignPMVZB validate[required]">'+_html4+'</select></a></td>';
			_html10 += '<td><div class="form-group"><div class="input-group" style="top: 8px;"><input type="text" readonly="readyonly" id="msetrafficDateVZT-'+_rowIndexNumber+'" name="msetrafficDateVZT" class="form-control msetrafficDateVZT validate[required]" /></div></div></td>';
			_html10 += '</tr>';
			_html10 += '<tr class="'+_uniqueIdForRow+' '+_uniqueId+' detailsRowPsc" id="subRow-assoc-'+_mainIdisplayIndex+''+displayIndex+'" style="display:none;" data-row-number="'+_rowIndexNumber+'"><td colspan="8"></td></tr>';
			return _html10;
		},
		getOrPostXMLHttpRequest : function(options){
			$.ajax(options);
		},
		createPSCRowAdd : function(){
			var _this=this,_subProjType = [],_subProjTypeHTML='';
			var _html1 =  '<option value="">--Please Select--</option>',_html5 = '<option value="">--Please Select--</option>';
			this.clliObject.sort(function(el1,el2){ return _this.compare(el1, el2, "CLLI") });
			$.each(this.clliObject,function(i,v){
				_html5 += '<option value="'+v.CLLI+'">'+v.CLLI+'</option>';
			});
			var cilli=_this.clliObject[0].CLLI,state=_this.clliObject[0].STATE,wireCenter=_this.clliObject[0].LOCATIONNAME,projectType=$.trim($('#serviceType').find('option:selected').text()),__value;
			var _combOfprojectName='PWR-'+state+'-'+wireCenter+'-'+projectType;
			__value='What :\n\n Why :\n\n Why Now :\n\n Why This Way :\n\n Add Proj Details :';
			$("#pscProjectDesc").val(__value);
			$.each(this.enggDisciplineData,function(i,v){
				_html1 += '<option value="'+v.enggdiscip_id+'">'+v.enggdiscip_name+'</option>';
			});
			$.each(allSubprojects,function(index,value){
				if ($.inArray(value.subProjTypeId, value.subProjTypeName) === -1) {
					_subProjType.push({"subProjTypeId":value.subProjTypeId, "subProjTypeName":value.subProjTypeName});
				}
			});
			_subProjType.sort(function(el1,el2){ return compare(el1,el2, "subProjTypeName") });
			$.each(_subProjType,function(index,value){
				_subProjTypeHTML += '<option value='+value['subProjTypeId']+'>'+value['subProjTypeName']+'</option>';
			});
			var _html4 = '';
			_html4 += '<option value="">--Please Select--</option>';
			_html4 +='<option value="Coast-to-Coast">Coast-to-Coast</option>';
			_html4 +='<option value="Data Centers">Data Centers</option>';
			_html4 +='<option value="North Atlantic">North Atlantic</option>';
			_html4 +='<option value="International">International</option>';
			_html4 +='<option value="Other">Other</option>';
			var _lastRowIndex = parseInt($('#pscTable > tbody tr.mainRowPSCInput').last().data('rowNumber')),_class = ($('#pscTable > tbody tr.mainRowPSCInput').last().hasClass('odd'))?'even':'odd';
			var _rowIndex = _lastRowIndex+1;
			lastRow=_rowIndex;
			var _html10 = '';
			_html10 += '<tr class="'+_class+' mainRowPSCInput" data-row-number="'+_rowIndex+'" id="defaultedRow-'+_rowIndex+'">';
			_html10 += '<td><a class="accordion-psc" id="accordion-psc-'+_rowIndex+'" data-row-index="'+_rowIndex+'" data-handler="off" href="javascript:void(0);"></a></td>';
			_html10 += '<td><select name="mseClliCodes" id="pscClliCodes-'+_rowIndex+'" class="form-control validate[required]  mseClliCodes location">'+_html5+'</select></a></td>';
			_html10 += '<td><div name="projectName" style="max-width: 350px;word-wrap: break-word;overflow: hidden;white-space: initial;" stateattr="'+state+'" oldprjname="'+_combOfprojectName+'"  id="projectName-'+_rowIndex+'">'+_combOfprojectName+'</div></a></td>';
			_html10 += '<td><div name="serviceType" id="serviceType-'+_rowIndex+'">'+$.trim($('#serviceType').find('option:selected').text())+'</div> </a></td>';
			_html10 += '<td><input type="text" name="ownerName" id="ownerName-'+_rowIndex+'" value="'+globalOwnerName+'" class="ownerName form-control customField ui-autocomplete-input" autocomplete="off" /></a></td>';
			_html10 += '<td><select name="subProjectType" id="subProjectType-'+_rowIndex+'"multiple="multiple" class="form-control mseassignPMVZB validate[required]">'+_subProjTypeHTML+'</select></a><div class="strip" style="display:none;"><ul><li><a href="javascript:void(0);"><span class="addModify"></span>Delete</a></li></ul></div></td>';
			_html10 += '<td><select name="budgetRegion" id="budgetRegion-'+_rowIndex+'" class="form-control mseassignPMVZB validate[required]">'+_html4+'</select></a></td>';
			_html10 += '<td><div class="form-group"><div class="input-group" style="top: 8px;"><input type="text" id="plConstDate-'+_rowIndex+'" name="plConstDate" class="form-control msetrafficDateVZT validate[required]" /></div></div></td>';
			_html10 += '</tr>';
			_html10 += '<tr class="detailsRowPsc" id="subRow-'+_rowIndex+'" style="display:none;" data-row-number="'+_rowIndex+'"><td colspan="8"></td></tr>';
			return _html10;
		},
		createPSCDataTable : function(enggDisciplineId,networkTypeId,projectTypeId,aaData){
			var _this = this;
			var _html1 =  '<option value="">--Please Select--</option>',_html5 = '<option value="">--Please Select--</option>';
			this.clliObject.sort(function(el1,el2){ return _this.compare(el1, el2, "CLLI") });
			$.each(this.clliObject,function(i,v){
				_html5 += '<option value="'+v.CLLI+'">'+v.CLLI+'</option>';
			});
			/*var cilli=_this.clliObject[0].CLLI,state=_this.clliObject[0].STATE,wireCenter=_this.clliObject[0].LOCATIONNAME,projectType=$.trim($('#serviceType').find('option:selected').text()),__value;
			_combOfprojectName='PWR-'+state+'-'+cilli+'-'+wireCenter+'-'+projectType;
			__value='What :\n\n Why :\n\n Why Now :\n\n Why This Way :\n\n Add Proj Details :';
			$("#pscProjectDesc").val(__value);*/

			$.each(this.enggDisciplineData,function(i,v){
				_html1 += '<option value="'+v.enggdiscip_id+'">'+v.enggdiscip_name+'</option>';
			});
			this.getOrPostXMLHttpRequest({
				type:'GET',
				async:false,
				url : contextPath+'/rest/projectInitation/getUserFullName?vzid='+userVZId,
				timeout: 90000,
				dataType: "json",
				contentType : "application/json",
				cache:false,
				success : function(data){
					var userName=data.sn +" "+data.givenName;
					$('#createdBy').text(userName);
					globalOwnerName=userName;
				},
				error : function(data){
					$('#step1_tab').show();
					$('#modal-one').hide();
				}
			});
			var _this=this,_subProjType = [],_subProjTypeHTML='';
			var dcPower=null,hvac=null,generator=null,acService=null,others=null;
			_this.getOrPostXMLHttpRequest({
				type:'GET',
				async:false,
				url : contextPath+'/rest/projectInitation/getSubProjTypes?dcPower='+dcPower+'&hvac='+hvac+'&generator='+generator+'&acService='+acService+'&others='+others,
				timeout: 90000,
				dataType: "json",
				contentType : "application/json",//sunil
				cache:false,
				success : function(data){
					allSubprojects=data.subProjTypes;
					$.each(allSubprojects,function(index,value){
						if ($.inArray(value.subProjTypeId, value.subProjTypeName) === -1) {
							_subProjType.push({"subProjTypeId":value.subProjTypeId, "subProjTypeName":value.subProjTypeName});
						}
					});
					_subProjType.sort(function(el1,el2){ return compare(el1,el2, "subProjTypeName") });
					$.each(_subProjType,function(index,value){
						_subProjTypeHTML += '<option value='+value['subProjTypeId']+'>'+value['subProjTypeName']+'</option>';
					});
				},
				error : function(data){
					$('#step1_tab').show();
					$('#modal-one').hide();
				}
			});
			var _html4 = '';
			_html4 += '<option value="">--Please Select--</option>';
			_html4 +='<option value="Coast-to-Coast">Coast-to-Coast</option>';
			_html4 +='<option value="Data Centers">Data Centers</option>';
			_html4 +='<option value="North Atlantic">North Atlantic</option>';
			_html4 +='<option value="International">International</option>';
			_html4 +='<option value="Other">Other</option>';
			var _columns = [];
			_columns[0] = {};
			_columns[0].sTitle = "";
			_columns[0].bVisible = true;
			_columns[0].sWidth = "3%";
			_columns[1] = {};
			_columns[1].sTitle = "Location<span class='reqfield'>*</span>";
			_columns[1].bVisible = true;
			_columns[1].sWidth = "16%";
			_columns[2] = {};
			_columns[2].sTitle = "Project Name<span class='reqfield'>*</span>";
			_columns[2].bVisible = true;
			_columns[2].sWidth = "16%";
			_columns[3] = {};
			_columns[3].sTitle = "Project Type<span class='reqfield'>*</span>";
			_columns[3].bVisible = true;
			_columns[3].sWidth = "16%";
			_columns[4] = {};
			_columns[4].sTitle = "Owner<span class='reqfield'>*</span>";
			_columns[4].bVisible = true;
			_columns[4].sWidth = "16%";
			_columns[5] = {};
			_columns[5].sTitle = "Sub Project Type(S)<span class='reqfield'>*</span>";
			_columns[5].bVisible = true;
			_columns[5].sWidth = "17%";
			_columns[6] = {};
			_columns[6].sTitle = "Budget Region<span class='reqfield'>*</span>";
			_columns[6].bVisible = true;
			_columns[6].sWidth = "17%";
			_columns[7] = {};
			_columns[7].sTitle = "Planned Construction Complete Date<span class='reqfield'>*</span>";
			_columns[7].bVisible = true;
			_columns[7].sWidth = "16%";
			this.clliQuestionsTablePSC = $('#pscTable').dataTable({
				"aaData": aaData,
				"bDestroy" : true,
				"bPaginate" : false,
				"bSort" : false,
				"bFilter" : false,
				"bInfo" : false,
				"bLengthChange" : false,
				"aoColumns" : _columns,
				"bAutoWidth" : false,
				"bStateSave": true,
				"fnStateSaveCallback" : function(settings,data) {
					localStorage.setItem( 'DataTables_' + settings.sInstance, JSON.stringify(data) );
				},//<input type="text" name="owner" id="owner" class="form-control customField ui-autocomplete-input" autocomplete="off">
				"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
					$(nRow).attr('data-row-number',iDisplayIndex);
					$(nRow).attr('id','defaultedRow-'+iDisplayIndex);
					$(nRow).addClass('mainRowPSCInput');
					$(nRow).find('td:eq(0)').html('<a class="accordion-psc" id="accordion-psc-'+iDisplayIndex+'" data-row-index="'+iDisplayIndex+'" data-handler="off" href="javascript:void(0);"></a>');
					$(nRow).find('td:eq(1)').html('<select name="mseClliCodes" id="pscClliCodes-'+iDisplayIndex+'" class="form-control validate[required]  mseClliCodes location">'+_html5+'</select>');
					$(nRow).find('td:eq(2)').html('<div name="projectName" style="max-width: 350px;word-wrap: break-word;overflow: hidden;white-space: initial;" id="projectName-'+iDisplayIndex+'"  ></div>');
					$(nRow).find('td:eq(3)').html('<div name="serviceType" id="serviceType-'+iDisplayIndex+'"></div>');
					$(nRow).find('td:eq(4)').html('<input type="text" name="ownerName" id="ownerName-'+iDisplayIndex+'"  class="ownerName form-control" autocomplete="off" />');
					$(nRow).find('td:eq(5)').html('<select name="subProjectType" id="subProjectType-'+iDisplayIndex+'" multiple="multiple" class="form-control mseassignPMVZB validate[required]">'+_subProjTypeHTML+'</select>');
					$(nRow).find('td:eq(6)').html('<select name="budgetRegion" id="budgetRegion-'+iDisplayIndex+'" class="form-control mseassignPMVZB validate[required]">'+_html4+'</select>');
					$(nRow).find('td:eq(7)').html('<div class="form-group" style="position: relative;bottom: 3px;"><div class="input-group" style="position: absolute;"><input type="text" id="plConstDate-'+iDisplayIndex+'" name="plConstDate" class="form-control msetrafficDateVZT validate[required]" /></div></div>');
				},
				"fnInitComplete" : function(){
					$(".msetrafficDateVZT").datepicker({
						buttonImage: contextPath+'/includes/css/images/calendar.png',
					  	buttonImageOnly: true,
					  	changeMonth: true,
					  	changeYear: true,
					  	showOn: 'both',
					  	minDate : 0,
					  	beforeShowDay: function(date) {
							var day = date.getDay();
							return [(day != 0 && day != 6), ''];
					  	},
					  	onSelect :function(dateText,inst){
					  		if(typeof dateText != 'undefined' && dateText != ''){
					  			$(this).blur();
					  		}
					  	}
					}); 
					$('.overlay-mse').hide();
					$('#mseProjectFrm').validationEngine('attach', {promptPosition : "bottomLeft", scroll: false});
					$('#mseTable_wrapper').removeClass('form-inline');
				},
				"fnDrawCallback":function(nRow,aData, iDisplayIndex, iDisplayIndexFull){
				},
				"fnCreatedRow" : function(nRow,aData,iDataIndex){
				}
			});
			$('#pscTable > tbody tr').each(function(i){
				var _rowNumber = $(this).data('rowNumber');
				var clliObj=_this.clliObject[i].CLLI;
				$('#pscClliCodes-'+_rowNumber+'').val(clliObj);
				$('#pscClliCodes-'+_rowNumber).attr("oldclli",clliObj);
				 var cilli=_this.clliObject[i].CLLI,state=_this.clliObject[i].STATE,wireCenter=_this.clliObject[i].LOCATIONNAME,projectType=$.trim($('#serviceType').find('option:selected').text()),__value;
					_combOfprojectName='PWR-'+state+'-'+cilli+'-'+wireCenter+'-'+projectType;
					__value='What :\n\nWhy :\n\nWhy Now :\n\nWhy This Way :\n\nAdd Proj Details :';
				$('#projectName-'+_rowNumber).attr("oldprjname",_combOfprojectName);
				_this.clliPrjName[clliObj] = _combOfprojectName;
				//16685 start
				_serviceType = ($.trim($('#serviceType').val()) != "" && $.trim($('#serviceType').val()) != "null" && $.trim($('#serviceType').val()) != null)?$.trim($('#serviceType').find('option:selected').text()):"";				
				_country = _this.clliObject[i].COUNTRY;
				_html1 = 'PWR-'+_country+"-"+_serviceType;      
				$.ajax({
				url: contextPath+"/rest/projectInitation/sequence",
				type: "GET",
				dataType: "json", 
				success: function(data) {
				seqNo = data.result;
				$('#pscDesc').val(_html1+"-"+seqNo);
				} 
				}); 
				//16685 end
				$("#pscProjectDesc").val(__value);
				$('#projectName-'+_rowNumber+'').text(_combOfprojectName);
				$('#ownerName-'+_rowNumber+'').val(globalOwnerName);
				$('#serviceType-'+_rowNumber+'').text($.trim($('#serviceType').find('option:selected').text()));
				$('#subProjectType-'+_rowNumber).multiselect('rebuild');
				$('#subProjectType-'+_rowNumber).next().find('label.checkbox input[type=checkbox]').css('display','block'); //18184
				$('#pscTable td input[type="checkbox"]').css('width','12px');//18184
				$('.dropdown-menu').css('overflow','hidden');//18184
				$('.dropdown-menu').css('width','auto');//18184
				$('.dropdown-menu >li > a').css('margin-left','-20px');//18184				
				$('<tr class="detailsRowPsc" id="subRow-'+_rowNumber+'" style="display:none;" data-row-number="'+i+'"><td colspan="8"></td></tr>').insertAfter(this);
				$(this).find('.accordion-psc').trigger('click');
			});
		},
		getProjDesc: function(){
			var _what = ($.trim($('#what').val()) != "" && $.trim($('#what').val()) != "null" && $.trim($('#what').val()) != null)?$.trim($('#what').val()):"",
					_why = ($.trim($('#why').val()) != "" && $.trim($('#why').val()) != "null" && $.trim($('#why').val()) != null)?$.trim($('#why').val()):"",
					_whyNow = ($.trim($('#whyNow').val()) != "" && $.trim($('#whyNow').val()) != "null" && $.trim($('#whyNow').val()) != null)?$.trim($('#whyNow').val()):"",
							_whyThisWay = ($.trim($('#whyThisWay').val()) != "" && $.trim($('#whyThisWay').val()) != "null" && $.trim($('#whyThisWay').val()) != null)?$.trim($('#whyThisWay').val()):"",
					_addProjDtls = ($.trim($('#addProjDtls').val()) != "" && $.trim($('#addProjDtls').val()) != "null" && $.trim($('#addProjDtls').val()) != null)?$.trim($('#addProjDtls').val()):"";
			temp='What :'+_what+'\n\n Why :'+_why+'\n\n Why Now :'+_whyNow+'\n\n Why This Way :'+_whyThisWay+'\n\n Add Proj Details :'+_addProjDtls;
			$('#pscProjectDesc').val(temp);
		},
		resetMessageHandler : function(){
			$('.vzuui-alertMsg_holder-mse').find('.msg').hide();
		},
		doAdvancedSearch : function(){
			var _data = $('#modal-two-mse').data(),_this = this;
			if($.trim($('#stateMSE').val())!=''){
				this.stateSelectedSearch = $.trim($('#stateMSE').val());
			}
			if(_data.isloading == false){
				$('#modal-two-mse').show();
				$('.taskdatacontainer.clliLoc2MSE').hide();
				$('#modal-two-mse').data('isloading',true);
			}
			var lob = (this.lobValue == 'T')?'VZT':(this.lobValue == 'B')?'VZB':'C';
			this.advanceSearchTable = $('#advancedSearchTableMSE').dataTable({
				"bRetrieve": true,
				"bDestroy":true,
				"bServerSide": true, 
				"bProcessing" : true,
				"bFilter" : false,
				"sDom" : '<"dataTables_wrapper no-footer"<"dataTables_filter">rt<"pull-right inlineBlock"lpi>>',
				"bSort":false,
				"bAutoWidth": false,
				"aoColumnDefs": [
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 },
					{ "responsivePriority": 1 }
				], 
				"aoColumns" : [
					{"sTitle": "CLLI","sWidth": "5%","mData": "CLLI","defaultContent": "<i>N/A</i>","bSortable":false,"bVisible":true},
					{"sTitle": "Sitecode","sWidth": "5%","mData": "SITECODE","defaultContent": "<i>N/A</i>","bSortable":false,"bVisible":true},
					{"sTitle": "vSAP Sitecode","sWidth": "7%","mData": "VSAPSITECODE","defaultContent": "<i>N/A</i>","bSortable":false,"bVisible":true},
					{"sTitle": "GEO CODE","sWidth": "6%","mData" : "GEOCODE","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "Street","sWidth": "5%","mData" : "STREET","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "City","sWidth": "4%","mData" : "CITY","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "State","sWidth": "4%","mData" : "STATE","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "Zip","sWidth": "3%","mData" : "ZIP","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "Location Name","sWidth": "15%","mData" : "LOCATIONNAME","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "Plant","sWidth": "3%","mData" : "PLANT","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "Sub Plant","sWidth": "6%","mData" : "SUBPLANT","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "Company","sWidth": "5%","mData" : "COMPANY","defaultContent": "<i>N/A</i>","bSortable":false,"bVisible":true},
					{"sTitle": "Business Unit","sWidth": "7%","mData" : "BUSINESSUNIT","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "MUX Code","sWidth": "6%","mData" : "MUXCODE","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "TCOMS Building ID","sWidth": "10%","mData" : "BUILDINGID","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true},
					{"sTitle": "TCOMS Location ID","sWidth": "10%","mData" : "LOCATIONID","defaultContent": "<i>N/A</i>" ,"bSortable":false,"bVisible":true}
				],
				"sAjaxSource" : contextPath+'/rest/projectInitation/advanceSearch?sSearch_0='+$.trim($('#clliMSE').val())+'&sSearch_1='+$.trim($('#geoMSE').val())+'&sSearch_2='+$.trim($('#locNameMSE').val())+'&sSearch_3='+$.trim($('#sitecodeMSE').val())+'&sSearch_4='+$.trim($('#companyMSE').val())+'&sSearch_5='+$.trim($('#plantMSE').val())+'&sSearch_6='+$.trim($('#subplantMSE').val())+'&sSearch_7='+$.trim($('#bunitMSE').val())+'&sSearch_8='+$.trim($('#streetMSE').val())+'&sSearch_9='+$.trim($('#cityMSE').val())+'&sSearch_10='+$.trim($('#stateMSE').val())+'&sSearch_11='+$.trim($('#zipMSE').val())+'&sSearch_12='+$.trim($('#muxCodeMSE').val())+'&sSearch_13='+$.trim($('#tComsBuildingIdMSE').val())+'&sSearch_14='+$.trim($('#sitecode1MSE').val())+'&sSearch_15='+lob+'&sSearch_16='+$.trim($('#tComsLocationIdMSE').val()),
	            "oLanguage" : {
	            	"sSearch" : "Filter :"
	            },
				"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
					if($(nRow).hasClass('active')){
						if($.trim(aData.CLLI) != $.trim(_clliSiteCode)){
							$(nRow).removeClass('active');
						}
					}
					$(nRow).unbind('click').bind('click',function(){
						_this.resetMessageHandler();
						$('#advancedSearchTableMSE > tbody tr').removeClass('active');
						$(this).addClass('active');
	                    _this.actualCilliCodes.push(aData.CLLI);
						_this.addLocationResults(aData);
					});
				},
				"fnInitComplete" : function(){
					$('#advancedSearchTableMSE_wrapper').find('.dataTables_filter').attr('id','advancedSearchTable_filter');
					$('#advancedSearchTableMSE_filter').html('<label>Filter :<input type="search" id="advancedSearchFilter_Search" class="" placeholder="CLLI, Street, City, State, Zip, Location Name" aria-controls="advancedSearchTable" style="width: 300px; margin-bottom: 10px;"></label>');
					var _data = $('#modal-two-mse').data();
					if(_data.isloading == true){
						$('#modal-two-mse').hide();
						$('.taskdatacontainer.clliLoc2MSE').show();
						$('#modal-two-mse').data('isloading',false);
					}
				}
			});
		},
		checkValidations : function(clli){
			if(!this.containElement(clli)){
				this.showMessage('error','Selected CLLI / Sitecode should be unique.. Please select different CLLI / Sitecode for different Locations');
				$(window).scrollTop(0);
				return false;
			}
			return true;
		},
		containElement : function(searchElement){
			if(this.aaData.length == 0){
				return true;
			}
			var cnt = 0;
			for(var i=0;i<this.aaData.length;i++){
				if(typeof searchElement != 'undefined' && searchElement == this.aaData[i].CLLI){
					cnt = cnt+1;
				}
			}
			if(cnt > 0){
				return false;
			}
			return true;
		},
		addLocationResults : function(aData){
			var _jsonObject = {};
			if(this.checkValidations(aData.CLLI)){
				if(this.lobValue == 'B' && aData.is_VZT_VZB != 'VZB'){
					this.showMessage('error','Please select SITECODE(6 Characters) for VZB Transport');
					$(window).scrollTop(0);
				}
				else if(this.lobValue == 'T' && aData.is_VZT_VZB != 'VZT'){
					this.showMessage('error','Please select CLLI(8 or 11 Characters) code for VZT Transport');
					$(window).scrollTop(0);
				} else {
					if(this.lobValue == 'B' && aaData.length == 2){
						this.showMessage('error','Maximum limit reached for VZB Transport');
						$(window).scrollTop(0);
					} else {
						$('#delLocationMSE').show();
						_jsonObject.CLLI = $.trim(aData.CLLI);
						_jsonObject.SITECODE = aData.SITECODE;
						_jsonObject.STREET = aData.STREET;
						_jsonObject.CITY = aData.CITY;
						_jsonObject.STATE = aData.STATE;
						_jsonObject.ZIP = aData.ZIP;
						_jsonObject.LOCATIONNAME = aData.LOCATIONNAME;
						_jsonObject.is_VZT_VZB = aData.is_VZT_VZB;
						_jsonObject.buildingId = aData.BUILDINGID;
						_jsonObject.locationCode = aData.LOCATIONID;
						_jsonObject.salesCity = aData.SALES_CITY;
						this.aaData.push(_jsonObject);
						this.clliResultsTable.fnClearTable();
						this.clliResultsTable.fnAddData(this.aaData);
					}
				}
			}
		},
		deleteLocations : function(index){
			this.aaData.splice(index,1);
			this.clliResultsTable.fnDeleteRow(parseInt(index));
		},
		initializeResultsTable : function(){
			var that = this;
			if(typeof this.clliResultsTable === 'object'){
			}
			this.clliResultsTable = $('#resultsTableFinalMSE').dataTable({
				"aaData": that.aaData,
				"bRetrieve": true,
				"bDestroy":true,
				"bPaginate" : false,
				"bSort" : false,
				"bFilter" : false,
				"bInfo" : false,
				"bLengthChange" : false,
				"aoColumns" : [
					{"sTitle": "<div class=\"checkbox vzbs-checkbox\"><input type=\"checkbox\" name=\"checkallLocationMSE\" id=\"checkallLocationMSE\" role=\"checkbox\" data-validation=\"checkbox_group\" /><label class=\"padding-right\"></label></div>","sWidth": "10%","mData": "","defaultContent": "<i>N/A</i>"},
					{"sTitle": "CLLI","sWidth": "10%","mData": "CLLI","defaultContent": "<i>N/A</i>"},
					{"sTitle": "SITE CODE","sWidth": "10%","mData": "SITECODE","defaultContent": "<i>N/A</i>"},
					{"sTitle": "Street","sWidth": "10%","mData" : "STREET","defaultContent": "<i>N/A</i>" },
					{"sTitle": "City","sWidth": "10%","mData" : "CITY","defaultContent": "<i>N/A</i>" },
					{"sTitle": "State","sWidth": "10%","mData" : "STATE","defaultContent": "<i>N/A</i>" },
					{"sTitle": "Zip","sWidth": "10%","mData" : "ZIP","defaultContent": "<i>N/A</i>" },
					{"sTitle": "Location Name","sWidth": "20%","mData" : "LOCATIONNAME","defaultContent": "<i>N/A</i>" },
					{"sTitle": "Action","sWidth": "7%","mData" : "","defaultContent": "<i>N/A</i>" },
					{"sTitle": "","sWidth": "0%","mData" : "is_VZT_VZB","defaultContent": "<i>N/A</i>","bVisible": false }
				],
				"oLanguage" : {
				},
				"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
					if(that.aaData.length != 0){
						$('td:eq(0)',nRow).html('<div class="checkbox vzbs-checkbox"><input type="checkbox" role="checkbox" data-validation="checkbox_group" id="location_mse_'+iDisplayIndex+'" name="location_mse_'+iDisplayIndex+'" class="locationsSelected" value="'+iDisplayIndex+'" style="z-index: 101;" /><label class="padding-right"></label></div>');
						$('td:eq(8)',nRow).html('<a style="cursor: pointer;" class="removeLocationMSE">Delete Location</a>');
						$(nRow).find('a.removeLocationMSE').unbind('click').bind('click',function(){
							that.deleteLocations(iDisplayIndex);
						});
						if($('#checkallLocationMSE').is(':checked')){
							$('td:eq(0)',nRow).find('input[type="checkbox"]').prop('checked',true);
						} else {
							$('td:eq(0)',nRow).find('input[type="checkbox"]').prop('checked',false);
						}
					}
				},
				"fnInitComplete" : function(){
					if(that.aaData.length > 0){
						$('#delLocationMSE').show();
					}
				},
				"fnDrawCallback":function(){
					$('input[type="checkbox"][id^="location_mse_"]').unbind('click').bind('click',function(){
						var _locationLength = $('input[type="checkbox"][id^="location_mse_"]').length,_selectedLocationLength = $('input[type="checkbox"][id^="location_mse_"]:checked').length;
						if(_locationLength == _selectedLocationLength){
							$('#checkallLocationMSE').prop('checked',true);
						} else {
							$('#checkallLocationMSE').prop('checked',false);
						}
					});
				}
			});
		},
		fnFormatDetails : function(nTr,rowNum,data){
			var sOut = '<div>';
			var _cnt=0,_this = this;
			$.each(data.userQuestions,function(index,value){
				if(_cnt == 0){
					sOut += '<div class="row">';
				}
				var _class = "",_checked = "";
				if(value.PROJECT_SELECT_DETAILS == 'DC Power' || value.PROJECT_SELECT_DETAILS == 'HVAC' || value.PROJECT_SELECT_DETAILS == 'Generator' || value.PROJECT_SELECT_DETAILS == 'AC Service' || value.PROJECT_SELECT_DETAILS == 'Other'){
					switch(value.DEFAULT_CHOICE){
						case "Y":
							_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_off_mse defaultVal ques quesAssoc":"vzuui-onOff_toggle_off_mse ques defaultVal enableSubProjectType";
							_checked = 'checked="true"';
							break;
						case "YE":
						case "E":
							_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_off_mse ques quesAssoc":"vzuui-onOff_toggle_off_mse ques enableSubProjectType enableSubProjectType";
							_checked = 'checked="true"';
							break;
						case "N":
						case "NE":
							_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_mse on ques quesAssoc":"vzuui-onOff_toggle_mse on ques enableSubProjectType";
							break;
						default:
							_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_mse on ques defaultVal quesAssoc":"vzuui-onOff_toggle_mse on defaultVal ques enableSubProjectType";
					}
				} else{
					switch(value.DEFAULT_CHOICE){
					case "Y":
						_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_off_mse defaultVal ques quesAssoc":"vzuui-onOff_toggle_off_mse ques defaultVal";
						_checked = 'checked="true"';
						break;
					case "YE":
					case "E":
						_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_off_mse ques quesAssoc":"vzuui-onOff_toggle_off_mse ques";
						_checked = 'checked="true"';
						break;
					case "N":
					case "NE":
						_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_mse on ques quesAssoc":"vzuui-onOff_toggle_mse on ques";
						break;
					default:
						_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_mse on ques defaultVal quesAssoc":"vzuui-onOff_toggle_mse on defaultVal ques";
				}
				}
				var _dataAssociationObj = {};
				if(!$.isEmptyObject(value.QUESTION_ASSOC)){
					_dataAssociationObj = value.QUESTION_ASSOC;
				}
				sOut += '<div class="col-md-3" data-projectSelectId="'+rowNum+'-'+value.PROJECT_SELECT_ID+'" data-ques-row-number="'+rowNum+'"><div class="form-group">'
				+'<label>'+value.PROJECT_SELECT_DETAILS+' <span class="tooltips" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="'+value.HOVER_OVER_TEXT+'"><i class="fa fa-info-circle fa-2"></i></span></label>'
				+'<div id="'+rowNum+'-projectDetails_'+value.PROJECT_SELECT_ID+'" data-association-object=\''+JSON.stringify(_dataAssociationObj)+'\' data-label-name="'+value.PROJECT_SELECT_DETAILS+'" data-question-id="'+value.PROJECT_SELECT_ID+'" data-question-key="'+_this.questionKeys[value.PROJECT_SELECT_ID]+'" class="'+_class+'" data-meshreq="0"><div class="btn1"></div> </div>'
				+'<input type="checkbox" name="'+rowNum+'-questions_'+index+'" '+_checked+' id="'+rowNum+'-questions_'+value.PROJECT_SELECT_ID+'" style="vertical-align: middle;display:none;" />'
				+'</div></div>';
				
				_cnt++;
				if(_cnt == 4){
					sOut += '</div>';
					_cnt = 0;
				}
			});
			sOut += '</div>';
			return sOut;
		},
		fnFormatDetails1NEquip : function(nTr,rowNum,data){
			var sOut = '<div>';
			var _cnt=0,_this = this;
			$.each(data.userQuestions,function(index,value){
				if(_cnt == 0){
					sOut += '<div class="row">';
				}
				var _class = "",_checked = "";
				switch(value.DEFAULT_CHOICE){
					case "Y":
						_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_off_mse1N defaultVal ques quesAssoc":"vzuui-onOff_toggle_off_mse1N ques defaultVal";
						_checked = 'checked="true"';
						break;
					case "YE":
					case "E":
						_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_off_mse1N ques quesAssoc":"vzuui-onOff_toggle_off_mse1N ques";
						_checked = 'checked="true"';
						break;
					case "N":
					case "NE":
						_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_mse1N on ques quesAssoc":"vzuui-onOff_toggle_mse1N on ques";
						break;
					default:
						_class = (!$.isEmptyObject(value.QUESTION_ASSOC))?"vzuui-onOff_toggle_mse1N on ques defaultVal quesAssoc":"vzuui-onOff_toggle_mse1N on defaultVal ques";
				}
				var _dataAssociationObj = {};
				if(!$.isEmptyObject(value.QUESTION_ASSOC)){
					_dataAssociationObj = value.QUESTION_ASSOC;
				}
				sOut += '<div class="col-md-3" data-projectSelectId="'+rowNum+'-'+value.PROJECT_SELECT_ID+'" data-ques-row-number="'+rowNum+'"><div class="form-group">'
				+'<label>'+value.PROJECT_SELECT_DETAILS+' <span class="tooltips" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="'+value.HOVER_OVER_TEXT+'"><i class="fa fa-info-circle fa-2"></i></span></label>'
				+'<div id="'+rowNum+'-projectDetails_'+value.PROJECT_SELECT_ID+'" data-association-object=\''+JSON.stringify(_dataAssociationObj)+'\' data-question-id="'+value.PROJECT_SELECT_ID+'" data-question-key="'+_this.questionKeys[value.PROJECT_SELECT_ID]+'" class="'+_class+'" data-meshreq="0"><div class="btn1"></div> </div>'
				+'<input type="checkbox" name="'+rowNum+'-questions_'+index+'" '+_checked+' id="'+rowNum+'-questions_'+value.PROJECT_SELECT_ID+'" style="vertical-align: middle;display:none;" />'
				+'</div></div>';
				_cnt++;
				if(_cnt == 4){
					sOut += '</div>';
					_cnt = 0;
				}
			});
			sOut += '</div>';
			return sOut;
		}
	};
}());
$.fn.dataTableExt.oApi.fnAddTr = function ( oSettings, nTr, bRedraw ) {
    if ( typeof bRedraw == 'undefined' ){
        bRedraw = false;
    }
    var nTds = nTr.getElementsByTagName('td');
    if ( nTds.length != oSettings.aoColumns.length ){
        alert( 'Warning: not adding new TR - columns and TD elements must match' );
        return;
    }
    var aData = [];
    var aInvisible = [];
    for ( var i=0 ; i<nTds.length ; i++ ){
        aData.push( nTds[i].innerHTML );
        if (!oSettings.aoColumns[i].bVisible){
            aInvisible.push( i );
        }
    }
    var iIndex = this.oApi._fnAddData( oSettings, aData );
    nTr._DT_RowIndex = iIndex;
    oSettings.aoData[ iIndex ].nTr = nTr;
    oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
    for ( var i = (aInvisible.length - 1) ; i >= 0 ; i-- ){
        oSettings.aoData[iIndex]._anHidden[ i ] = nTds[aInvisible[i]];
        nTr.removeChild( nTds[aInvisible[i]] );
    }
    if ( bRedraw ){
        this.oApi._fnReDraw( oSettings );
    }
};
$.widget("ui.autocomplete", $.ui.autocomplete, {
  _renderMenu: function(ul, items) {
    var that = this;
    ul.attr("class", "nav nav-pills nav-stacked  bs-autocomplete-menu");
    $.each(items, function(index, item) {
      that._renderItemData(ul, item);
    });
  },
 
  _resizeMenu: function() {
    var ul = this.menu.element;
    ul.outerWidth(Math.min(
      // Firefox wraps long text (possibly a rounding bug)
      // so we add 1px to avoid the wrapping (#7513)
      ul.width("").outerWidth() + 1,
      this.element.outerWidth()
    ));
  }
 
});
$.extend({ alert: function (message, title) {
	  $("<div></div>").dialog( {
	    buttons: { "Ok": function () { $(this).dialog("close"); } },
	    close: function (event, ui) { $(this).remove(); },
	    resizable: false,
	    title: title,
	    modal: true,
	    position: [(document.body.scrollheight/2) - 600/2, 40]
	  }).html("<span><b>"+message+"</b></span>");
	}
});
function formatSLADate(date){
	_dateandTime = date.split(" ");
	_time = _dateandTime[1].split(":");
	_time[0]="12";
	var _time1 = _time.join(":");
	faRftDate=_dateandTime[0];
	var _newDates =  _dateandTime[0]+'T'+_time1+'Z';
	var _newNextDate = new Date(_newDates); 
	return _newNextDate;
}