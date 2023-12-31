@if($setting['form-method'] =='native')
<div class="card">
	<div class="card-body">
@endif
		<div class="form-ajax-box">
		{!! Form::open(array('url'=>'{class}?return='.$return, 'class'=>'form-{form_display}  threedrenders-form validated','files' => true , 'parsley-validate'=>'','novalidate'=>' ','id'=> '{class}FormAjax')) !!}

			<div class="toolbar-nav">	
				<div class="row">	
					
					<div class="col-md-6">
						<a href="javascript://ajax" onclick="ajaxViewClose('#{{ $pageModule }}')" class="tips btn btn-sm btn-danger  " title="{{ __('core.btn_back') }}" ><i class="fa  fa-times"></i></a>
					</div>
					<div class="col-sm-6 text-right">	
						<div class="btn-group">
							<button type="submit" class="btn btn-sm  btn-primary " name="apply"> {{ Lang::get('core.sb_apply') }} </button>
							<button type="submit" class="btn btn-sm btn-success" name="save">  {{ Lang::get('core.sb_save') }} </button>
						</div>	
					</div>	
							
				</div>
			</div>	
				<div class="row">

			
			{form_entry}									
			{masterdetailform}	
			<input type="hidden" name="action_task" value="save" />				
						


			

			
		{!! Form::close() !!}
		</div>

@if($setting['form-method'] =='native')

	</div>
</div>
@endif

@include('threedrenders.module.template.ajax.formjavascript')

<script type="text/javascript">
$(document).ready(function() { 
	{form_javascript} 
	{masterdetailjs}
	{form_wizard} 
				
	var form = $('#{class}FormAjax'); 
	form.parsley();
	form.submit(function(){
		
		if(form.parsley().isValid()){			
			var options = { 
				dataType:      'json', 
				beforeSubmit :  function(){
				},
				success: function(data) {
					if(data.status == 'success')
					{
						ajaxViewClose('#{{ $pageModule }}');
						var table = $('#{class}Table').DataTable();
						table.ajax.reload();
						notyMessage(data.message);	
						$('#threedrenders-modal').modal('hide');
					} else {
						notyMessageError(data.message);	
						return false;
					}
				}  
			}  
			$(this).ajaxSubmit(options); 
			return false;
						
		} else {
			return false;
		}		
	
	});

});

</script>		 