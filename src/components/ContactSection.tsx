import { getPublicTestContactEmail } from '../config/contact.mjs'

const testContactEmail = getPublicTestContactEmail(import.meta.env)

export function ContactSection() {
  return (
    <section aria-labelledby="experimental-contact-heading" className="border-t border-slate-200 bg-white px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Experimental website</p>
        <h2 id="experimental-contact-heading" className="mt-2 text-2xl font-bold text-slate-950">Contact the owner about this experiment</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          This is an owner-controlled GEO content experiment. There is no contact form or automatic email processing.
        </p>
        {testContactEmail ? (
          <p className="mt-4 text-sm text-slate-700">
            Public test contact:{' '}
            <a className="font-semibold text-blue-700 underline" href={`mailto:${testContactEmail}`}>
              {testContactEmail}
            </a>
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-500">A public test contact channel is not enabled.</p>
        )}
      </div>
    </section>
  )
}
