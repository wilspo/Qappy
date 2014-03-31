#!/usr/bin/env ruby
require 'open-uri'
require 'fileutils'
require 'colorize'

typings_dir = "lib/typings/"

libs = File.readlines('typings').collect{|x| x.strip}

libs.each do |lib|
    file_path = File.join(typings_dir, lib, "#{lib}.d.ts")
    puts "Downloading Definition for " + "#{lib}".light_cyan + " to: " + "'#{file_path}'".yellow
    FileUtils.mkpath(File.dirname(file_path))
    open(file_path, 'wb') do |file|
        file << open("https://github.com/borisyankov/DefinitelyTyped/raw/master/#{lib}/#{lib}.d.ts").read
    end
end


all_file = File.join(typings_dir, 'all.d.ts');
puts "Creating All Typings File at: " + "#{all_file}".yellow
File.open(all_file, 'w+') do |file|
    libs.each do |lib|
        file.puts "/// <reference path='./#{lib}/#{lib}.d.ts' />"
    end
end