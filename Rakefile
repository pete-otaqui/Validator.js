require 'jsdoc-toolkit/doc_task'
# rake throws a warning because jsdoc-toolkit doesn't do this:
include Rake::DSL

JsDocToolkit::DocTask.new(:jsdoc) {|doc|
  doc.jsdoc_dir = 'docs'
  doc.jsdoc_files << 'validator.js'
}

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

