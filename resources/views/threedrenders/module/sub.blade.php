@extends('layouts.app')

@section('content')
<div class="page-header"><h2>  {{ $pageTitle }} <small>Configuration</small> </h2></div>
 


    @include('threedrenders.module.tab',array('active'=>'sub','type'=>  $type ))


    {!! Form::open(array('url'=>'threedrenders/module/savesub/'.$module_name, 'class'=>'form-horizontal ' ,'id'=>'fSub')) !!}

        <input  type='text' name='master' id='master'  value='{{ $row->module_name }}'  style="display:none;" /> 
        <input  type='text' name='module_id' id='module_id'  value='{{ $row->module_id }}'  style="display:none;" />

         <div class="form-group">
          <label for="ipt" class=" control-label col-md-4"> Link Title <code>*</code></label>
          <div class="col-md-8">
            {!! Form::text('title', null,array('class'=>'form-control form-control-sm', 'placeholder'=>'' ,'required'=>'true')) !!} 
           <i class="text-danger"> Important ! ,  <small> Do  not use white space </small></i>
          </div> 
        </div>   

        <div class="form-group">
          <label for="ipt" class=" control-label col-md-4">Master Key <code>*</code></label>
        <div class="col-md-8">

              <select name="master_key" id="master_key" required="true" class="form-control form-control-sm"> 
              <?php foreach($fields as $field) {?>
                        <option value="<?php echo $field['field'];?>" ><?php echo $field['field'];?></option>   
              <?php } ?>      
                    </select>   
         </div> 
        </div>  

        <div class="form-group">
          <label for="ipt" class=" control-label col-md-4"> Module Target </label>
        <div class="col-md-8">
              <select name="module" id="module" required="true" class="form-control form-control-sm">
              <option value="">-- Select Module --</option> 
              <?php foreach($modules as $module) {?>
                <option value="<?php echo $module['module_name'];?>"  ><?php echo $module['module_title'];?></option>
              <?php } ?>
                    </select>
         </div> 
        </div>  

         <div class="form-group">
          <label for="ipt" class=" control-label col-md-4">DB Table Module Target <code>*</code></label>
        <div class="col-md-8">
          <select name="table" id="table" required="true" class="form-control form-control-sm">       
                    </select> 
         </div> 
        </div>       

         <div class="form-group">
          <label for="ipt" class=" control-label col-md-4">Detail Key <code>*</code></label>
        <div class="col-md-8">
          <select name="key" id="key" required="true" class="form-control form-control-sm">
          </select> 
         </div> 
        </div>     

         <div class="form-group">
          <label for="ipt" class=" control-label col-md-4"></label>
        <div class="col-md-8">
          <button name="submit" type="submit" class="btn btn-primary btn-sm"> Save Master Detail </button>
         </div> 
        </div> 
      
     {!! Form::close() !!}


    <div class="table-responsive" style="margin-bottom:40px;">

    <table class="table table-striped">
    <thead class="no-border">
      <tr>
        <th >Title</th>
        <th >Master Key</th>
        <th >Module Class</th>
        <th data-hide="phone">Database Table</th>
        <th data-hide="phone">Relation Key</th>
        <th data-hide="phone">Action</th>
      </tr>
    </thead>
    <tbody class="no-border-x no-border-y"> 
      @foreach($subs as $rows)
      <tr>
        <td><?php echo $rows['title'];?></td>
        <td><?php echo $rows['master_key'];?></td>
        <td><?php echo $rows['module'];?></td>
        <td><?php echo $rows['table'];?></td>
        <td><?php echo $rows['key'];?></td>
        <td><a  href="javascript:void(0)" 
        onclick="ThreedrendersConfirmDelete('{{ URL::to('threedrenders/module/removesub?id='.$row->module_id.'&mod='.$rows['module']) }}');"
        class="btn "><i class="fa fa-trash"></i> </a></td>
      
      </tr>
      @endforeach   
      
      
    </tbody>      
     
    </table>      

</div>

 <script>
$(document).ready(function(){   
    $("#table").jCombo("{{ url('threedrenders/module/combotable') }}",
    { }); 
    $("#key").jCombo("{{ url('threedrenders/module/combotablefield') }}?table=",
    { parent  :  "#table"}); 
});
</script> 

<script type="text/javascript">
  $(document).ready(function(){

    <?php echo ThreedrendersHelpers::sjForm('fSub'); ?>

  })
</script>
@stop