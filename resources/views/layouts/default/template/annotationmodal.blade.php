<div class="modal fade" id="annotation-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog  modal-lg modal-dialog-centered">
        <div class="modal-content rounded shadow border-0">
            <div class="modal-body p-0">
                <div class="container-fluid px-0">
                    <div class="row align-items-center g-0">


                        <div class="col-12 p-5">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="reply-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog  modal-lg modal-dialog-centered">
        <div class="modal-content rounded shadow border-0">
            <div class="modal-body p-0">
                <div class="container-fluid px-0">
                    <div class="row align-items-center g-0">


                        <div class="col-12 p-5">
                            <div class="row">

                                <div class="col-lg-12">
                                    <div class="mb-3">
                                        <label class="form-label">Floor Plan <span class="text-danger"> Required</span></label><br>
                                        <div class="form-icon position-relative pt-2">


                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6 mb-0">
                                    <div class="d-grid">
                                        <button class="btn btn-danger" onclick="javascript:removeReply()">Cancel</button>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="edit-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog  modal-lg modal-dialog-centered">
        <div class="modal-content rounded shadow border-0">
            <div class="modal-body p-0">
                <div class="container-fluid px-0">
                    <div class="row align-items-center g-0">


                        <div class="col-12 p-5">
                            <div class="row">


                                <div class="col-lg-12">
                                    <div class="mb-3">

                                        <div class="form-icon position-relative annotation-input">
                                            <i data-feather="message-square" class="fea icon-sm icons"></i>
                                            <textarea class="form-control ps-5 mention textarea"  name="description" placeholder="Type your message"
                                                      required="" id="edit-comment"></textarea>
                                        </div>
                                    </div>
                                </div>


                                <div class="col-lg-6 mb-0">
                                    <div class="d-grid">
                                        <button class="btn btn-primary" onclick="javascript:sendeditMessage()">Edit</button>
                                    </div>
                                </div>

                                <div class="col-lg-6 mb-0">
                                    <div class="d-grid">
                                        <button class="btn btn-danger" onclick="javascript:removeEdit()">Cancel</button>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>