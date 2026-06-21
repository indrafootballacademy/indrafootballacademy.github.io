/* ============================================================
   ProStrike — Sign In Modal Injector
   Adds the sign-in modal to any page that doesn't have it.
   Include this script on all pages for consistent sign-in behavior.
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // If the login modal doesn't exist on this page, inject it
    if (!document.getElementById('loginModal')) {
        const modalHTML = `
        <div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg" style="border-radius: 20px; overflow: hidden;">
                    <div class="row g-0">
                        <div class="col-lg-4 d-none d-lg-block" style="background: linear-gradient(135deg, #1a73e8, #0d47a1); padding: 2.5rem;">
                            <div class="d-flex flex-column justify-content-center h-100 text-white">
                                <h4 class="fw-bold mb-3">Welcome Back!</h4>
                                <p class="text-white-50 mb-4">Sign in to access your coaching dashboard, track progress, and manage registrations.</p>
                                <ul class="list-unstyled">
                                    <li class="mb-3 d-flex align-items-center">
                                        <i class="bi bi-shield-check text-warning me-2 fs-5"></i>
                                        <small>Secure — no passwords stored</small>
                                    </li>
                                    <li class="mb-3 d-flex align-items-center">
                                        <i class="bi bi-lightning text-warning me-2 fs-5"></i>
                                        <small>One-click sign in</small>
                                    </li>
                                    <li class="mb-3 d-flex align-items-center">
                                        <i class="bi bi-graph-up text-warning me-2 fs-5"></i>
                                        <small>Track your progress</small>
                                    </li>
                                </ul>
                                <div class="mt-auto pt-3">
                                    <small class="text-white-50"><i class="bi bi-lock-fill me-1"></i>Your data is encrypted</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-8">
                            <div class="p-4 p-lg-5">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h4 class="fw-bold mb-1">Sign In</h4>
                                        <p class="text-muted mb-0">Choose your preferred method</p>
                                    </div>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                
                                <button class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 py-3 mb-3" style="border-radius: 10px; border: 2px solid #e9ecef;" onclick="signInWithGoogle()">
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span class="fw-semibold">Continue with Google</span>
                                </button>
                                
                                <button class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 py-3 mb-4" style="border-radius: 10px; border: 2px solid #e9ecef;" onclick="signInWithMicrosoft()">
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <rect fill="#F25022" x="1" y="1" width="10" height="10"/>
                                        <rect fill="#7FBA00" x="13" y="1" width="10" height="10"/>
                                        <rect fill="#00A4EF" x="1" y="13" width="10" height="10"/>
                                        <rect fill="#FFB900" x="13" y="13" width="10" height="10"/>
                                    </svg>
                                    <span class="fw-semibold">Continue with Microsoft / Outlook</span>
                                </button>
                                
                                <hr>
                                <div class="text-center">
                                    <small class="text-muted">
                                        <i class="bi bi-shield-fill-check text-success me-1"></i>
                                        Protected by OAuth 2.0
                                    </small>
                                </div>
                                <div class="text-center mt-3">
                                    <small class="text-muted">Don't have an account? <a href="register.html" class="fw-semibold text-decoration-none text-primary">Register here</a></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
});
