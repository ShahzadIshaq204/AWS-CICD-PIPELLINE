
@if($contentType==0 OR $contentType==1)
<section class="wrapper bg-soft-primary">
    <div class="container pt-10 pb-19 pt-md-14 pb-md-20 text-center">
        <div class="row mt-15">
            <div class="col-md-10 col-xl-8 mx-auto">
                <div class="post-header">

                    <!-- /.post-category -->
                    <h1 class="display-1 mb-4">{{$title}}</h1>

                    <!-- /.post-meta -->
                </div>
                <!-- /.post-header -->
            </div>
            <!-- /column -->
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container -->
</section>
@endif

<!-- /section -->
@if($contentType==2)
    <section class="wrapper bg-soft-primary angled lower-start">
        <div class="pt-10 pb-19 pt-md-14 pb-md-20 ">
            <div class="row col-md-10 col-xl-8 mx-auto align-items-center mt-15">
                <div class="col-lg-6" data-cues="slideInDown" data-group="page-title" data-delay="600">
                    <h1 class="display-1 text-dark mb-4">{{$title}}</h1>

                </div>
                @if($image!="")
                <div class="col-lg-5 offset-lg-1 mb-n18" data-cues="slideInDown">
                    <div class="position-relative light-gallery-wrapper">

                        <figure class="rounded shadow-lg"><img src="{{url('uploads/images/'.$image)}}" srcset="{{url('uploads/images/'.$image)}} 2x" alt=""></figure>
                    </div>
                    <!-- /div -->
                </div>
                @endif
                <!-- /column -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </section>

@endif
<section class="wrapper bg-light">
    <div class="container pb-14 pb-md-16">
        <div class="row">
            <div class="col-lg-10 mx-auto">
                <div class="blog single  @if($contentType==0 OR $contentType==1 ) mt-n17 @else mt-n10 @endif">
                    <div class="card">
                        @if($image!="")
                        @if($contentType==0 OR $contentType==1 )
                        <figure class="card-img-top"><img src="{{url('uploads/images/'.$image)}}" alt="" /></figure>
                        @endif
                        @endif
                            <div class="card-body">
                            <div class="classic-view">
                                <article class="post">
                                    <div class="post-content mb-5">
                                        <?php echo $content ;?>
                                    </div>
                                    <!-- /.post-content -->
                                    <div class="post-footer d-md-flex flex-md-row justify-content-end align-items-center mt-8">

                                        <div class="mb-0 mb-md-2">
                                            <div class="dropdown share-dropdown btn-group">
                                                <button class="btn btn-sm btn-red rounded-pill btn-icon btn-icon-start dropdown-toggle mb-0 me-0" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i class="uil uil-share-alt"></i> Partager </button>
                                                <div class="dropdown-menu">
                                                    <a class="dropdown-item" href="https://twitter.com/intent/tweet?url={{urlencode(url()->current())}}" target="_blank"><i class="uil uil-twitter"></i>Twitter</a>
                                                    <a class="dropdown-item" href="https://www.facebook.com/sharer/sharer.php?u={{url()->current()}}" target="_blank"><i class="uil uil-facebook-f"></i>Facebook</a>
                                                    <a class="dropdown-item" href="https://www.linkedin.com/sharing/share-offsite/?url={{url()->current()}}" target="_blank"><i class="uil uil-linkedin"></i>Linkedin</a>
                                                </div>
                                                <!--/.dropdown-menu -->
                                            </div>
                                            <!--/.share-dropdown -->
                                        </div>
                                    </div>
                                    <!-- /.post-footer -->
                                </article>
                                <!-- /.post -->
                            </div>

                        </div>
                        <!-- /.card-body -->
                    </div>
                    <!-- /.card -->
                </div>
                <!-- /.blog -->
            </div>
            <!-- /column -->
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container -->
</section>

