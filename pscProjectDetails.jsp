<%@ taglib uri="csrfTagLib" prefix="csrf"%>
<div class="" id="modal-psc" style=""><div class="col-md-12 margin-top-bottom text-center"><span class="vz-loading-gif"><i class="fa fa-spinner fa-3 fa-spin"></i></span></div></div>
<div id="psc" class="section ll-skin-santiago" style="display:none;">
	<div id="default" >
		<div id="projectDetailsPSC">
			<form id="definePrjctDtlsTab" name="definePrjctDtlsTab">
				<input type="hidden" name ="<csrf:tokenname/>" value="<csrf:tokenvalue/>">
				<div id="dynamicUserQuestions"></div>
				<div class="clearfix" style="height:15px;"></div>
				<div id="remainId">
				<div class="row">
					<div class="col-md-4">
							<div class="form-group">
								<label><span class="reqfield">*</span>Project Name:</label>
								<input type="text" name="pscProjectName" id="pscProjectName"  readonly="readonly" class="form-control validate[required]" />
							</div>
					 </div>
				     <div class="col-md-4">
						<div class="form-group">
							<label><span class="reqfield">*</span>SubProjectType</label>
							<select name="subProjectType" id="subProjectType" data-type="network" multiple="multiple" class="form-control">
							</select>
						</div>
					</div>
					<div class="col-md-2">
						<div class="form-group">
							<label><span class="reqfield">*</span>BudgetRegion :</label>
							<select name="Budget Region" id="budgetRegion" data-type="network" class="form-control validate[required]" >
								<option value="">--Please Select--</option>
								<option value="Coast-to-Coast">Coast-to-Coast</option>
								<option value="Data Centers">Data Centers</option>
								<option value="North Atlantic">North Atlantic</option>
								<option value="International">International</option>
								<option value="Other">Other</option>
							</select>
							<!--  <div class="label-data">Budget Region</div>-->
						</div>
					</div>
					<div class="col-md-2">
						<div class="form-group">
							<label>NRN # :</label>
							 <input type="text" name="nRn" id="nRn" class="form-control validate[required]" maxlength="100" /> 
						</div>
					</div>
				</div>
					<div class="row">
						<div class="col-md-2">
							<div class="form-group">
								<label><span class="reqfield" >*</span>Created By  :</label>
								<div id="createdBy"></div>
							</div>
						</div>
						<div class="col-md-2">
							<div class="form-group">
								<label><span class="reqfield">*</span>Owner :</label>
								<input type="text" name="owner" id="owner" class="form-control customField ui-autocomplete-input" autocomplete="off" />
								<!-- <div class="form-group">
								<select name="owner" id="owner" data-type="network" class="form-control validate[required]">
									<option value="">--Please Select--</option>
								</select>
								</div> -->
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
								<label><span class="reqfield">*</span>Planned Construction Complete Date:</label>
								<div class="input-group">
									<input type="text" readonly="readyonly" name="pscCompldate" id="pscCompldate" class="form-control datepicker1 " />
								</div>
							</div>
						</div>
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
										<input type="text" name="addProjDtls" id="addProjDtls" class="form-control validate[required]"  />
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
					</div>
					</form>
					</div>
					<div class="clearfix" style="clear:both;height:15px;"></div>
		<div class="row">
			<div class="col-md-6">
				<ul class="buttonContainer">
					<li><button type="button" class="btn btn-default btn-sm closeedit" data-form="1" id="pscForm3Back">Back</button></li>
					<li><button type="button" class="btn btn-danger btn-sm saveedit" id="pscForm3Next">Submit</button></li>
					<li><button type="button" class="btn btn-default btn-sm closeedit" id="pscForm3Cancel">Cancel</button></li>
				</ul>
			</div>
		</div> 
</div></div>
<script>
$(function(){
	pscDetails.init();
});
</script>