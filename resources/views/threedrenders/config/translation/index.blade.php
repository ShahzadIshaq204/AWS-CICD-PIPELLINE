@extends('layouts.app')


@section('content')
<div class="page-header"><h2> {{ $pageTitle }}  <small> {{ $pageNote }} </small> </h2></div>
<div class="card">
<div class="card-body"> 

		@include('threedrenders.config.tab',array('active'=>'translation'))
<div class="toolbar-nav">
<a href="{{ URL::to('threedrenders/config/addtranslation')}} " onclick="ThreedrendersModal(this.href,'Add New Language');return false;" class="btn btn-sm btn-primary"><i class="fa fa-plus"></i> New Language </a>
</div> 
	
 	{!! Form::open(array('url'=>'threedrenders/config/translation/', 'class'=>'form-vertical ')) !!}
		<div class="card"> 
			
			
			<table class="table table-borderd">
				<thead>
					<tr>
						<th> Name </th>
						<th> Folder </th>
						<th> Author </th>
						<th> Action </th>
					</tr>
				</thead>
				<tbody>		
			
				@foreach(SiteHelpers::langOption() as $lang)
					<tr>
						<td>  {{  $lang['name'] }}   </td>
						<td> {{  $lang['folder'] }} </td>
						<td> {{  $lang['author'] }} </td>
					  	<td>
						@if($lang['folder'] !='en')
						<a href="{{ URL::to('threedrenders/config/translation?edit='.$lang['folder'])}} " class="btn"> Manage </a>
						<a href="{{ URL::to('threedrenders/config/removetranslation/'.$lang['folder'])}} " onclick="ThreedrendersConfirmDelete(this.href); return false;" class="btn "> Delete </a>
						 
						@endif 
					
					</td>
					</tr>
				@endforeach
				
				</tbody>
			</table>
		</div>
		{!! Form::close() !!}
	</div>
</div>	
@endsection