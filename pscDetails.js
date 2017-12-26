$(document).ajaxComplete(function() {

});
//18184 START
$(document).on('change','.multiselect-container', function(){
	console.log("In monitor");
	if($(this).find('input[type="checkbox"]').is(':checked')){	
	$('#subProjectType').next().find('ul > li').removeClass('active');	
	$(this).find('li').removeClass('active');
}
});
//18184 START
var projectOwnerId = "";
var pscDetails = (function(){
	return{
		init : function(){
			this.projectInit = new Project();
			this.clliObject = (typeof aaData != 'undefined')?aaData:[];
			console.log(JSON.stringify(this.clliObject));
			$('#piDiv').show();
			$('#modal-psc').hide();
			$('#psc').show();
			$("#form3Next").prop("disabled",true);
			$("#form3Next").css({'opacity':'0.30','cursor':'text'});
			$('.datepicker1').datepicker({
				changeMonth: true,
				changeYear: true,
				showOn: "button",
				buttonImage: contextPath+"/includes/css/images/calendar.png",
				buttonImageOnly: true,
				minDate: 0,
				beforeShowDay: function(date) {
					var day = date.getDay();
					return [(day != 0 && day != 6), ''];
				}
			});
			this.getOrPostXMLHttpRequest({
				type:'GET',
				url : contextPath+'/rest/projectInitation/getUserFullName?vzid='+userVZId,
				timeout: 90000,
				dataType: "json",
				contentType : "application/json",
				cache:false,
				success : function(data){
					var userName=data.sn +" "+data.givenName;
					$('#createdBy').text(userName);
					$('#owner').val(userName);
				},
				error : function(data){
					$('#step1_tab').show();
					$('#modal-one').hide();
				}
			});
			this.attachEvents();
			this.getSubProjTypes();
		},
		attachEvents : function(){
			var _this=this;
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
		
		$(document).on('keyup keydown','#owner',function(e){
			if(e.keyCode != 8 && e.keyCode != 9 && e.keyCode != 18 && e.keyCode != 32 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 46) {
				var value =  $('#owner').val();
				console.log("Code: " + e.keyCode + ", Value: " + value);
				if(value.length > 2) {
					$("#owner").autocomplete({
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
				        	console.log(ui.item.id);
				        	projectOwnerId = ui.item.id;
				        }
				    });
				}
			}
		});
		var cilli=_this.clliObject[0].CLLI,
		state=_this.clliObject[0].STATE,
		wireCenter=_this.clliObject[0].LOCATIONNAME,
		projectType=$.trim($('#serviceType').find('option:selected').text()),
		_value,__value;
		
		_value='PWR-'+state+'-'+cilli+'-'+wireCenter+'-'+projectType;
		console.log(_value);
		$('#pscProjectName').val(_value);
		__value="PROJECT NAME: "+$.trim($('#pscProjectName').val().replace(/&/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/"/g, ""))+'\n\nWhat:\n\nWhy:\n\nWhy Now:\n\nWhy This Way:\n\nAdd Proj Details:';
		$("#pscProjectDesc").val(__value);

		$(document).on('click','#projectDetails_14,#projectDetails_15,#projectDetails_16,#projectDetails_17,#projectDetails_18',function(e){
			var dcPower=($('#questions_14').is(':checked'))?'DC Power':'null',
			hvac=($('#questions_15').is(':checked'))?'HVAC':'null',
			generator=($('#questions_16').is(':checked'))?'Generator':'null',
			acService=($('#questions_17').is(':checked'))?'AC Service':'null',
			others=($('#questions_18').is(':checked'))?'Other':'null',
			_value1;
			_value1=_value+(($('#questions_14').is(':checked'))?'-DC Power':'')
	        +(($('#questions_15').is(':checked'))?'-HVAC':'')+(($('#questions_16').is(':checked'))?'-Generator':'')
	        +(($('#questions_17').is(':checked'))?'-AC Service':'')+(($('#questions_18').is(':checked'))?'-Other':'');
			console.log(_value);
			$('#pscProjectName').val(_value1);
			_this.getProjDesc();
			_this.getSubProjTypes(dcPower,hvac,generator,acService,others);
		});
		
		$('#pscForm3Next').on('click',function(){
			$('#definePrjctDtlsFrm').validationEngine('attach', {promptPosition : "bottomLeft", scroll: false});
			if($('#definePrjctDtlsFrm').validationEngine('validate')){
				if($('.multiselect-container').find('input[type="checkbox"]:checked').length>0){
					$('.vzuui-alertMsg_holder').find('.msg').hide();
				    _this.savePscProject();
				}
				else{
					project.showMessage('error','Please select atleast one Subproject');
				}
			}
		});
		$(document).on('click','#pscForm3Back',function(){
			processStep($('#pscForm3Back'));
		});
		$(document).on('click','#pscForm3Cancel',function(){
			window.location.reload(true);
		});
		 processStep = function($this){
			var _data = $($this).data();
			switch(_data.form){
				case 0:
					changePage(1);
					break;
				case 1:
					changePage(2);
					break;
				case 2:
					changePage(3);
					break;
				default:
			}
		}
		 changePage = function(pageNo){
				var _projectTypeObj = {};
				_projectTypeObj.projectTypeId = $('#projectType').val();
				$("#navigationID").removeAttr("class");
				$("#navigationID").addClass("active"+pageNo);
				$('.vzuui-navigator-timeline').find('.vzuui-todo_holder_content').hide();
				$('.vzuui-navigator-timeline').find('.vzuui-todo_holder_content').eq((pageNo-1)).show();	
		 }
	},
	
	getSubProjTypes : function(dcPower,hvac,generator,acService,others){
		var _this=this,
		_subProjType = [],_subProjTypeHTML='';
		_this.getOrPostXMLHttpRequest({
			type:'GET',
			url : contextPath+'/rest/projectInitation/getSubProjTypes?dcPower='+dcPower+'&hvac='+hvac+'&generator='+generator+'&acService='+acService+'&others='+others,
			timeout: 90000,
			dataType: "json",
			contentType : "application/json",
			cache:false,
			success : function(data){
				console.log("data.subProjTypes : "+data.subProjTypes);
				$.each(data.subProjTypes,function(index,value){
					if ($.inArray(value.subProjTypeId, value.subProjTypeName) === -1) {
						_subProjType.push({"subProjTypeId":value.subProjTypeId, "subProjTypeName":value.subProjTypeName});
					}
				});
				_subProjType.sort(function(el1,el2){ return compare(el1,el2, "subProjTypeName") });
				$.each(_subProjType,function(index,value){
					_subProjTypeHTML += '<option value='+value['subProjTypeId']+'>'+value['subProjTypeName']+'</option>';
				});
				$('#subProjectType').html(_subProjTypeHTML);
				$('#subProjectType').multiselect('rebuild');
				$('#subProjectType').next().find('label.checkbox input[type=checkbox]').css('display','block');	//18184		
			},
			error : function(data){
				$('#step1_tab').show();
				$('#modal-one').hide();
			}
		});				
	},	
	getProjDesc: function(){
		var _what = ($.trim($('#what').val()) != "" && $.trim($('#what').val()) != "null" && $.trim($('#what').val()) != null)?$.trim($('#what').val()):"",
				_why = ($.trim($('#why').val()) != "" && $.trim($('#why').val()) != "null" && $.trim($('#why').val()) != null)?$.trim($('#why').val()):"",
				_whyNow = ($.trim($('#whyNow').val()) != "" && $.trim($('#whyNow').val()) != "null" && $.trim($('#whyNow').val()) != null)?$.trim($('#whyNow').val()):"",
						_whyThisWay = ($.trim($('#whyThisWay').val()) != "" && $.trim($('#whyThisWay').val()) != "null" && $.trim($('#whyThisWay').val()) != null)?$.trim($('#whyThisWay').val()):"",
				_addProjDtls = ($.trim($('#addProjDtls').val()) != "" && $.trim($('#addProjDtls').val()) != "null" && $.trim($('#addProjDtls').val()) != null)?$.trim($('#addProjDtls').val()):"";
		temp='PROJECT NAME: '+$.trim($('#pscProjectName').val().replace(/&/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/"/g, ""))+'\n\n What: '+_what+'\n\n Why: '+_why+'\n\n Why Now: '+_whyNow+'\n\n Why This Way: '+_whyThisWay+'\n\n Add Proj Details: '+_addProjDtls;
		$('#pscProjectDesc').val(temp);
	},
	savePscProject : function(){
		var projectOwner = userVZId;
		var subProjectOptions='';
		if(projectOwnerId != "") {
			projectOwner = projectOwnerId;
		}
		var selectedOption = $('#subProjectType option:selected');
        var selected = [];
        $(selectedOption).each(function() {
          selected.push([$(this).text()]);
        });
        subProjectOptions = selected.join(" | ");
        //console.log("subProjectOptions========="+subProjectOptions);
		var _bonitaParams={}, _this=this,currentdate=new Date($.now()),datetime;
		_bonitaParams.networkActivityTypeId=$.trim($('#networkActivity').val());
		_bonitaParams.startDate = '2016-11-02';
		datetime =  (currentdate.getMonth()+1)+ "/" + currentdate.getDate() + "/"+currentdate.getFullYear();
		_bonitaParams.dueDate=$.trim($('#pscCompldate').val());
		_bonitaParams.projectName=$.trim($('#pscProjectName').val());
		_bonitaParams.projectTypeId=$.trim($('#projectType').val());
		_bonitaParams.serviceTypeId=$.trim($('#serviceType').val());
		_bonitaParams.projectDescription=$.trim($('#pscProjectDesc').val().replace(/\,\s/g, ",").replace(/'/g,""));
		_bonitaParams.engineeringDisciplineId=$.trim($('#engDiscipline').val());
		_bonitaParams.clliCode=this.clliObject[0].CLLI;
		_bonitaParams.payloadInfo = {};
		_bonitaParams.nfInfo={};
		_bonitaParams.nfInfo.nfidRequest={};
		_bonitaParams.payloadInfo.networkActivityType=$.trim($('#networkActivity').find('option:selected').text());
		_bonitaParams.payloadInfo.engineeringDiscipline = $.trim($('#engDiscipline').find('option:selected').text());
		_bonitaParams.payloadInfo.projectType = $.trim($('#projectType').find('option:selected').text());
		_bonitaParams.payloadInfo.serviceType = $.trim($('#serviceType').find('option:selected').text());
		_bonitaParams.payloadInfo.state=this.clliObject[0].STATE;
		_bonitaParams.payloadInfo.what = $.trim($('#what').val().replace(/\,\s/g, ",").replace(/'/g,""))
		_bonitaParams.payloadInfo.why = $.trim($('#why').val().replace(/\,\s/g, ",").replace(/'/g,""))
		_bonitaParams.payloadInfo.whyNow = $.trim($('#whyNow').find('option:selected').text().replace(/\,\s/g, ",").replace(/'/g,""))
		_bonitaParams.payloadInfo.whyThisWay=$.trim($('#whyThisWay').find('option:selected').text().replace(/\,\s/g, ",").replace(/'/g,""))
		_bonitaParams.payloadInfo.additionalProjectDetails=$.trim($('#addProjDtls').val().replace(/\,\s/g, ",").replace(/'/g,""))
		_bonitaParams.payloadInfo.telemetryRequired = ($('#questions_1').is(':checked'))?'Y':'N';
		_bonitaParams.payloadInfo.dcPower = ($('#questions_14').is(':checked'))?'Y':'N';
		_bonitaParams.payloadInfo.hvac = ($('#questions_15').is(':checked'))?'Y':'N';
		_bonitaParams.payloadInfo.generator = ($('#questions_16').is(':checked'))?'Y':'N';
		_bonitaParams.payloadInfo.acService = ($('#questions_17').is(':checked'))?'Y':'N';
		_bonitaParams.payloadInfo.other = ($('#questions_18').is(':checked'))?'Y':'N';
		_bonitaParams.payloadInfo.criticalPath = ($('#questions_23').is(':checked'))?'Y':'N';
		//_bonitaParams.payloadInfo.subProjectType=$.trim($('#subProjectType').find('option:selected').text().replace(/, /g,','));
		_bonitaParams.payloadInfo.subProjectType=subProjectOptions;
		_bonitaParams.payloadInfo.createdBy = userVZId;
		_bonitaParams.payloadInfo.owner=projectOwner;
 		_bonitaParams.payloadInfo.additionalProjectDetails=$.trim($('#addProjDtls').val().replace(/\,\s/g, ",").replace(/'/g,""));
		_bonitaParams.nfInfo.nfidRequest.systemName='WFM';
		_bonitaParams.nfInfo.nfidRequest.componentValue='CCR';
		_bonitaParams.nfInfo.nfidRequest.componentType='';
		_bonitaParams.payloadInfo.budgetRegion=$.trim($('#budgetRegion').find('option:selected').text());
		console.log("Payload info :"+JSON.stringify(_bonitaParams));
		 $('#step3_tab').hide();
		 $('#modal-one').show();
		console.log(JSON.stringify(_bonitaParams));
		_this.getOrPostXMLHttpRequest({
			url : contextPath+'/rest/projectInitation/createNFProject',
			type:'POST',
			timeout: 1000000,
			dataType: "json",
			contentType : "application/json",
			data:JSON.stringify(_bonitaParams),
			success : function(data){
				if(data != undefined && typeof data.nfID != "undefined" && data.nfID != "" && data.nfID != "null" && data.nfID != null && data.statusCode == 0){
					var dataObj=data;
					$('#step3_tab').show();
					$('#modal-one').hide();
					var _landingURL = '';
					if(typeof dataObj.nfID != "undefined" && dataObj.nfID != "" && dataObj.nfID != "null" && dataObj.nfID != null){
						_landingURL = _nfTreeUrl+'?nfid='+dataObj.nfID+'&uuiFlag=true&defaultView=Project Summary&newView=Y';
					} else {
						_landingURL = contextPath+'/projectInitDetails.jsp?projectId='+data.projectId+'&uuiFlag=true';
					}
					var _html = '';
					_html = '<div class="modal fade bs-example-modal-lg" id="myModal1" tabindex="-1" data-backdrop="static" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content">'
						+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">x</span></button><h4 class="modal-title" id="myModalLabel1">Project is created successfully with the following details</h4></div>'
						+'<div class="modal-body">'
						+'<div class="row">'
						+'<div class="col-md-6"><div class="label-content" style="display:inline-block;">NFID :</div> <div id="piAltNfId" class="label-data" style="display:inline-block;"><label id="flexiComponent21" elem-type="labelPlain" class="vzuui-flexi-label">'+dataObj.nfID+'</label></div></div>'
						+'</div>'
						+'<div class="row">'
						+'<div class="col-md-6"><div class="label-content" style="display:inline-block;">Project Name :</div><div class="label-data" style="display:inline-block;"><label id="flexiComponent22" elem-type="labelPlain" class="vzuui-flexi-label">'+$.trim($('#projectName').val().replace(/&/g,"").replace(/\</g,"").replace(/\>/g,"").replace(/"/g, ""))+'</label></div></div>'
						+'</div>'
						+'<div class="row"><div class="col-md-3"><a href="'+_landingURL+'" class="btn btn-danger btn-sm saveedit">Ok</a></div></div>'
						+'</div>'
						+'</div></div></div>';
					$('body').append(_html);
					$('#myModal1').modal('show');
				} else {
					_this.errorPopup(data.txId,'Bonita', 'Project Creation failed');
				}
				if(data != undefined && typeof data.nfID != "undefined" && data.nfID != "" && data.nfID != "null" && data.nfID != null && data.statusCode == 0){
					$.ajax({
						url: contextPath+'/rest/projectInitation/addProjectManagerResource',
						dataType: "json",
						data: {
							vzId: projectOwner,
							projectId: data.inProjectID,
							nfId: data.nfID 
						},
						success: function( data ) {
							//response(data);
						}
					});
				}
			},
			error : function(data){
				_this.errorPopup(data.txId, "WFM", data.statusMessage);
					}
			});
	
	
	},
	getOrPostXMLHttpRequest : function(options){
		$.ajax(options);
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
			+'<div class="col-md-6">Unable to complete your request due to failure in '+system+' Service. Operations team has been notified <b>WFM-PI-ONSHORE@one.verizon.com;WFM-PI-OFFSHORE@one.verizon.com</b> for assistance.</div>';
			if(txId!='' && typeof txId!='undefined' && txId!='undefined' && txId!=null && txId!="null"){
				_html +='<div>Please use the failure Reference id: <b>'+txId+'</b> for future communication.</div>'
			}
		_html +='</div>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'</div>';
		$('body').append(_html);
		$( "#myModalError" ).modal('show');
	}
}
	
}());

		