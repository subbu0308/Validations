<%
response.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
response.setHeader("Access-Control-Allow-Origin","*");
response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
%>
<% if(request.getParameter("uuiFlag")!=null){ %>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>Project Initiation - PSC</title>
		<link href="<%=request.getContextPath()%>/includes/css/bootstrap.min.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/includes/css/vzbootstrap.min.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/includes/css/dataTables.bootstrap.min.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/includes/css/custom-style.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/includes/css/ui-grid-advexp.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/includes/css/validationEngine.jquery.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/includes/css/daterangepicker.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet" type="text/css">
        <link href="<%=request.getContextPath()%>/includes/css/flexgrid.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet" type="text/css">
        <link href="<%=request.getContextPath()%>/includes/css/projectInit.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet">
		<link href="<%=request.getContextPath()%>/includes/css/bootstrap-multiselect.css?t=<%=System.currentTimeMillis()%>" rel="stylesheet">
		<script src="<%=request.getContextPath()%>/includes/js/jquery-1.12.0.min.js?t=<%=System.currentTimeMillis()%>"	type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/includes/js/bootstrap.min.js?t=<%=System.currentTimeMillis()%>"	type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/includes/js/vzbootstrap.min.js?t=<%=System.currentTimeMillis()%>"	type="text/javascript"></script>
		<script	src="<%=request.getContextPath()%>/includes/js/min/jquery-ui-1.10.2.custom.min.js?t=<%=System.currentTimeMillis()%>" type="text/javascript"></script>
		<script	src="<%=request.getContextPath()%>/includes/js/jquery.dataTables.min.js?t=<%=System.currentTimeMillis()%>" type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/includes/js/dataTables.bootstrap.min.js?t=<%=System.currentTimeMillis()%>" type="text/javascript"></script> 
		<script src="<%=request.getContextPath()%>/includes/js/dataTables.responsive.min.js?t=<%=System.currentTimeMillis()%>" type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/includes/js/responsive.bootstrap.min.js?t=<%=System.currentTimeMillis()%>" type="text/javascript"></script> 
		<script src="<%=request.getContextPath()%>/includes/js/datatable-basic.js?t=<%=System.currentTimeMillis()%>" type="text/javascript"></script> 
		<script	src="<%=request.getContextPath()%>/includes/js/min/jquery.validationEngine.min.js?t=<%=System.currentTimeMillis()%>"	type="text/javascript"></script>
		<script	src="<%=request.getContextPath()%>/includes/js/min/jquery.validationEngine-en.min.js?t=<%=System.currentTimeMillis()%>"	type="text/javascript"></script>
		<script	src="<%=request.getContextPath()%>/includes/js/min/jQuery.ajaxUpload.min.js?t=<%=System.currentTimeMillis()%>"	type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/includes/js/flexgrid.js?t=<%=System.currentTimeMillis()%>" type="text/javascript"></script>
		<script	src="<%=request.getContextPath()%>/includes/js/pscApp.js"	type="text/javascript"></script>
	   	<script src="<%=request.getContextPath()%>/includes/js/min/Combobox.min.js?t=<%=System.currentTimeMillis()%>" type="text/javascript"></script>
	   	<script src="<%=request.getContextPath()%>/includes/js/common.ui.resize.js?t=<%=System.currentTimeMillis()%>" type="text/javascript"></script>
	   	<script	src="<%=request.getContextPath()%>/includes/js/bootstrap-multiselect.js?t=<%=System.currentTimeMillis()%>"	type="text/javascript"></script>
	</head>
	<body>
	<% } %>
	<div class="overlay-mse" style=""><div class="col-md-12 margin-top-bottom text-center loadermse"><span class="vz-loading-gif"><i class="fa fa-spinner fa-3 fa-spin"></i></span></div></div>
	<div class="vzuui-alertMsg_holder-mse">  
	    <div class="alert alert-success clearfix msg" style="display:none;" role="alert"><span class="alert-icon"></span><p>Your information has been updated.</p></div>  
	    <div class="alert alert-danger clearfix msg" style="display:none;" role="alert"><span class="alert-icon"></span> <p>There was a problem.</p></div>  
	    <div class="alert alert-warning clearfix msg" style="display:none;" role="alert"><span class="alert-icon"></span> <p>There were problems.</p></div>
	    <div class="alert alert-info clearfix msg" style="display:none;" role="alert"><span class="alert-icon"></span> <p>A Informational message </p></div>
	</div>
	<div id="mseAppContainer">
	<% if(request.getParameter("uuiFlag")!=null){ %>
		<div id="flexGridExample" style="display:none;">
			<h3 data-order="1" selected="true">NFID</h3>
			<div>
   				<label id="flexiComponent11" elem-type="labelPlain" class="vzuui-flexi-label"></label>
  			</div>
  			<h3 data-order="2" selected="true">Status</h3>
  			<div>
   				<label id="flexiComponent21" elem-type="labelPlain" class="vzuui-flexi-label"></label>
  			</div>
  		</div>
		<div class="clearfix section-divider-bottom">
			<ul class="nav nav-tabs" role="tablist">
				<li id="home-tab" role="presentation" class="active"> <a href="#home" aria-controls="home" role="tab" data-toggle="tab"> Project Details </a> </li>
 				<li id="profile-tab" role="presentation"> <a href="#profile" aria-controls="profile" role="tab" data-toggle="tab"> Add Locations </a> </li>
			</ul>
			<div class="tab-content">
				<div role="tabpanel" class="tab-pane active" id="home" aria-labelledby="home-tab">
	<% } %>
					<form data-toggle="validator" role="form" id="mseProjectFrm" name="mseProjectFrm">
						<div id="pscDescripition">
							<div id="commonSection"></div>
								<div id="vztQuestionSection">
								<div class="row">
									<div class="col-md-3">
										<div class="form-group">
									  		<label><span class="reqfield">*</span>Description:</label>
									  		<input type="text" name="pscDesc" class="scidvzt validate[required] form-control" id="pscDesc" />
										</div>
								  </div>
									<div class="col-md-3">
										<div class="form-group">
											<label>vSAP Proj ID / nSAP AFE#:</label>
											<input type="text" name="projectIDVZT" id="projectIDVZT" class="projectIDVZT form-control" placeholder="Enter in vSAP Proj ID / nSAP AFE#" />
										</div>
									</div>
									<div class="col-md-3">
										<div class="form-group">
											<label>NRN #:</label>
											<input type="text" name="nrn" id="nrn" class="projectIDVZT form-control" placeholder="NRN" />
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div class="pull-right">
									<ul class="buttonContainer">
										<li><button type="button" class="btn btn-secondaryCTA btn-sm" id="addRowsPSC">Add Projects</button></li>
									</ul>
								</div>
							</div>
						</div>
						<div id="pscTableContainer">
							<table class="table table-striped  table-hover dt-responsive nowrap" id="pscTable" cellspacing="0" width="100%" data-pagination="true"></table>
						</div>
							<div class="row">
						<div class="col-md-6">
							<div class="row">
								<div class="col-md-12">
									<div class="form-group">
										<label><span class="reqfield">*</span>What:</label>
										<input type="text" name="what" id="what" class="form-control validate[required]" />
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<div class="form-group">
										<label><span class="reqfield">*</span>Why:</label>
										<input type="text" name="why" id="why" class="form-control validate[required]" />
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<div class="form-group">
										<label><span class="reqfield">*</span>Why Now:</label>
										<select name="whyNow" id="whyNow" data-type="network" class="form-control validate[required]" >
											<option value="">--Please Select--</option>
											<option value="Comply with Verizon standards / building codes">Comply with Verizon standards / building codes</option>
											<option value="Critical Path">Critical Path</option>
											<option value="Provide adequate power backup">Provide adequate power backup</option>
											<option value="Replace broken equipment">Replace broken equipment</option>
											<option value="Replace equipment in jeopardy">Replace equipment in jeopardy</option>
											<option value="Replace unreliable equipment">Replace unreliable equipment</option>
											<option value="Required equipment per impact analysis ">Required equipment per impact analysis </option>
											<option value="Retirement details">Retirement details</option>
											<option value="Risk of non-action">Risk of non-action</option>
											<option value="Supports incoming/ future equipment">Supports incoming/ future equipment</option>
										</select>
									<!--  	<input type="text" name="whyNow" id="whyNow" class="form-control validate[required]" /> -->
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<div class="form-group">
										<label><span class="reqfield">*</span>Why This Way:</label>
										<select name="what" id="whyThisWay" data-type="network" class="form-control validate[required]" >
											<option value="">--Please Select--</option>
											<option value="Capacity calculations">Capacity calculations</option>
											<option value="Available rebates">Available rebates</option>
											<option value="Comply with Verizon standards / building codes">Comply with Verizon standards / building codes</option>
											<option value="Energy savings">Energy savings</option>
											<option value="Equipment needs to be replaced">Equipment needs to be replaced</option>
											<option value="Equipment needs to be upgraded">Equipment needs to be upgraded</option>
											<option value="IP connectivity work on this project">IP connectivity work on this project</option>
											<option value="Most cost effective way">Most cost effective way</option>
											<option value="P/S Planner Consultation">P/S Planner Consultation</option>
											<option value="Providing what has been requested in WFM">Providing what has been requested in WFM</option>
											<option value="Required equipment per impact analysis">Required equipment per impact analysis</option>
											<option value="Required to support some equipment">Required to support some equipment</option>
											<option value="Reuse opportunities">Reuse opportunities</option>
										</select>
										<!--  <input type="text" name="what" id="whyThisWay" class="form-control validate[required]"  /> -->
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<div class="form-group">
										<label>Additional Project Details:</label>
										<input type="text" name="addProjDtls" id="addProjDtls" class="form-control"  />
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-6">
		  				<div class="form-group">
		  				<label><span class="reqfield">*</span>Project Description: <span class="tooltips"><i class="fa fa-info-circle fa-2"></i><span class="tooltiptext_top morecontent" id="projectDescToolTip"></span></span></label>
						<textarea name="pscProjectDesc" id="pscProjectDesc" class="form-control validate[required,minSize[10],maxSize[8000]]" style="height:280px!important;resize:none!important; font-style: italic; maxlength="8000"></textarea>
						<div id="pscDescMaxChar" style="display:none;color:#CCCCCC;text-weight:bold;position:absolute;bottom: 5%;right: 4%;"></div>
		  				</div>
		  				</div>
					</div>
					</form>
	<% if(request.getParameter("uuiFlag")!=null){ %>
					<div style="margin-top:10px;display:none;" id="projectIntNav">
						<ul class="buttonContainer">
							<li><button type="button" class="btn btn-danger btn-sm" id="form3MSENext">Submit</button></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<%	} else { %>
		<div style="margin-top:10px;" id="projectIntNav">
			<ul class="buttonContainer">
				<li><button type="button" class="btn btn-default btn-sm" data-form="2" id="form3MSEBack">Back</button></li>
				<li><button type="button" class="btn btn-danger btn-sm" id="form3MSENext">Submit</button></li>
				<li><button type="button" class="btn btn-default btn-sm" id="form3MSECancel">Cancel</button></li>
			</ul>
		</div>
		<% } %>
	</div>
	<%
	if(request.getParameter("uuiFlag")!=null){
	%>
	<script>
		var contextPath = "<%=org.owasp.esapi.ESAPI.encoder().encodeForJavaScript(request.getContextPath())%>",isDraft = true;
		var nfId = "<%=org.owasp.esapi.ESAPI.encoder().encodeForJavaScript(request.getParameter("nfid"))%>";
		$(function(){
			$('.overlay-mse').show();
			//pscApp.isMultiBuild = true;
		});
	</script>
	<% } else { %>
	<script>
		var contextPath = "<%=org.owasp.esapi.ESAPI.encoder().encodeForJavaScript(request.getContextPath())%>",isDraft = false;
		$(function(){
			pscApp.init();
		});
	</script>
	<% } %>
	<% if(request.getParameter("uuiFlag")!=null){ %>
	</body>
</html>
<% } %>