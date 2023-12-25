@extends('layouts.app')


@section('content')
<div class="page-titles">
  <h2> {{ $pageTitle }} <small> {{ $pageNote }} </small></h2>
</div>

<div class="  ">



                <!-- ============================================================== -->
                <!-- Sales overview chart -->
                <!-- ============================================================== -->
                <div class="row pb-4">
                    <div class="col-lg-9 col-md-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex no-block">
                                    <div>
                                        <h3 class="card-title m-b-5"><span class="lstick"></span>Sales Overview </h3>
                                    </div>
                                    <div class="ml-auto">
                                        <select class="custom-select b-0">
                                            <option selected="">January 2017</option>
                                            <option value="1">February 2017</option>
                                            <option value="2">March 2017</option>
                                            <option value="3">April 2017</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div id="chartdiv" class="p-relative" style="height:360px;"></div>
                            </div>
                            
                            
                        </div>
                    </div>
                    <!-- ============================================================== -->
                    <!-- visit charts-->
                    <!-- ============================================================== -->
                    <div class="col-lg-3 col-md-12">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title"><span class="lstick"></span>Visit Separation</h4>
                                <div id="visitor" style="height:290px; width:100%;"></div>
                                <table class="table vm font-14">
                                    <tr>
                                        <td class="b-0">Mobile</td>
                                        <td class="text-right font-medium b-0">38.5%</td>
                                    </tr>
                                    <tr>
                                        <td>Tablet</td>
                                        <td class="text-right font-medium">30.8%</td>
                                    </tr>
                                    <tr>
                                        <td>Desktop</td>
                                        <td class="text-right font-medium">7.7%</td>
                                    </tr>
                                    <tr>
                                        <td>Other</td>
                                        <td class="text-right font-medium">23.1%</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


                    <div class="row pb-4">
                    <div class="col-6 col-lg-3 mb-3">
                        <div class="card  ">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="m-r-20 align-self-center">
                                        <i class="fas fa-leaf text-info" style="font-size: 40px;"></i>
                                    </div>
                                    <div class="align-self-center ">
                                        <h6 class=" m-t-10 m-b-0">Total Income</h6>
                                        <h2 class="m-t-0 ">953,000</h2></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-lg-3 mb-3">
                        <div class="card ">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="m-r-20 align-self-center">
                                        <i class="fas fa-credit-card text-danger" style="font-size: 40px;"></i>
                                    </div>
                                    <div class="align-self-center">
                                        <h6 class="text-muted m-t-10 m-b-0">Total Expense</h6>
                                        <h2 class="m-t-0">236,000</h2></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-lg-3 mb-3">
                        <div class="card ">
                            <div class="card-body ">
                                <div class="d-flex">
                                    <div class="m-r-20 align-self-center">
                                        <i class="icon-badge text-primary" style="font-size: 40px;"></i>
                                    </div>
                                    <div class="align-self-center">
                                        <h6 class=" m-t-10 m-b-0">Total Assets</h6>
                                        <h2 class="m-t-0">987,563</h2></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class=" col-6 col-lg-3 mb-3">
                        <div class="card ">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="m-r-20 align-self-center">
                                        <i class="fas fa-users text-warning" style="font-size: 40px;"></i>
                                    </div>
                                    <div class="align-self-center">
                                        <h6 class="text-muted m-t-10 m-b-0">Total Staff</h6>
                                        <h2 class="m-t-0">987,563</h2></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
<!-- ============================================================== -->
                <!-- Twitter facebook and mail boxes -->
                <!-- ============================================================== -->
                <div class="row pb-4">
                    <div class="col-lg-4">
                        <div class="card bg-info text-white">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="stats">
                                        <h1 class="text-white">3257+</h1>
                                        <h6 class="text-white">Twitter Followers</h6>
                                        <button class="btn btn-rounded btn-outline btn-light m-t-10 font-14">Check list</button>
                                    </div>
                                    <div class="stats-icon text-right ml-auto"><i class="fab fa-twitter display-5 op-3 text-dark"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card bg-primary text-white">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="stats">
                                        <h1 class="text-white">6509+</h1>
                                        <h6 class="text-white">Facebook Likes</h6>
                                        <button class="btn btn-rounded btn-outline btn-light m-t-10 font-14">Check list</button>
                                    </div>
                                    <div class="stats-icon text-right ml-auto"><i class="fab fa-facebook-f display-5 op-3 text-dark"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card bg-success text-white">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="stats">
                                        <h1 class="text-white">9062+</h1>
                                        <h6 class="text-white">Subscribe</h6>
                                        <button class="btn btn-rounded btn-outline btn-light m-t-10 font-14">Check list</button>
                                    </div>
                                    <div class="stats-icon text-right ml-auto"><i class="fa fa-envelope display-5 op-3 text-dark"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
</div>

<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>

<script type="text/javascript">
  // Data retrieved from http://vikjavev.no/ver/index.php?spenn=2d&sluttid=16.06.2015.
$(function () {
    Highcharts.chart('chartdiv', {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: 'Monthly Statistic'
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 150,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    },
    xAxis: {
        categories: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ],
        plotBands: [{ // visualize the weekend
            from: 4.5,
            to: 6.5,
            color: 'rgba(68, 170, 213, .2)'
        }]
    },
    yAxis: {
        title: {
            text: 'Pegawai'
        }
    },
    tooltip: {
        shared: true,
        valueSuffix: ' Orang'
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        areaspline: {
            fillOpacity: 0.5
        }
    },
    series: [{
        name: 'Kehadiran',
        data: [3, 4, 3, 5, 4, 10, 12]
    }, {
        name: 'Alpa',
        data: [1, 3, 4, 3, 3, 5, 4]
    }
    , {
        name: 'Cuti',
        data: [4, 5,1, 6, 12, 3, 1]
    }]
});

});



</script>            
@stop